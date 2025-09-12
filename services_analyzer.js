const puppeteer = require('puppeteer');
const fs = require('fs');

async function analyzeServicesCarousel() {
    console.log('🔍 Starting focused services carousel analysis...');
    
    const browser = await puppeteer.launch({
        headless: false, // Show browser so you can see what's happening
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    try {
        console.log('📍 Navigating to services section...');
        await page.goto('http://localhost:3001/#services', { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000); // Wait for animations

        // 1. DETAILED ELEMENT DETECTION
        console.log('🕵️ Detecting services elements...');
        const elementInfo = await page.evaluate(() => {
            const container = document.querySelector('.services-marquee-container');
            if (!container) {
                return { error: 'Services container not found' };
            }

            // Look for various possible service card selectors
            const possibleSelectors = [
                '.service-card',
                '[class*="service"]',
                '[class*="card"]',
                '.marquee-item',
                '.services-marquee-container > *',
                '.services-marquee-container div',
                '.services-marquee-container > div > *'
            ];

            let serviceCards = [];
            let foundSelector = null;

            for (const selector of possibleSelectors) {
                const elements = container.querySelectorAll(selector);
                if (elements.length > 0) {
                    foundSelector = selector;
                    serviceCards = Array.from(elements);
                    break;
                }
            }

            return {
                containerFound: true,
                containerBounds: container.getBoundingClientRect(),
                containerStyles: {
                    width: container.offsetWidth,
                    height: container.offsetHeight,
                    overflow: getComputedStyle(container).overflow,
                    overflowX: getComputedStyle(container).overflowX,
                    position: getComputedStyle(container).position
                },
                serviceCards: {
                    foundSelector,
                    count: serviceCards.length,
                    cards: serviceCards.slice(0, 5).map((card, index) => {
                        const bounds = card.getBoundingClientRect();
                        const computed = getComputedStyle(card);
                        
                        // Get all text content
                        const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button');
                        const textContent = Array.from(textElements)
                            .filter(el => el.textContent.trim())
                            .map(el => ({
                                tag: el.tagName.toLowerCase(),
                                text: el.textContent.trim(),
                                fontSize: getComputedStyle(el).fontSize,
                                color: getComputedStyle(el).color,
                                fontWeight: getComputedStyle(el).fontWeight,
                                opacity: getComputedStyle(el).opacity,
                                visible: bounds.width > 0 && bounds.height > 0
                            }));

                        return {
                            index,
                            bounds: {
                                x: bounds.x,
                                y: bounds.y,
                                width: bounds.width,
                                height: bounds.height,
                                isVisible: bounds.width > 0 && bounds.height > 0,
                                isInViewport: bounds.x < window.innerWidth && bounds.x + bounds.width > 0
                            },
                            styles: {
                                backgroundColor: computed.backgroundColor,
                                opacity: computed.opacity,
                                transform: computed.transform,
                                zIndex: computed.zIndex
                            },
                            textContent
                        };
                    })
                }
            };
        });

        console.log('📊 Element detection results:', JSON.stringify(elementInfo, null, 2));

        // 2. TAKE FOCUSED SCREENSHOTS
        console.log('📸 Taking focused screenshots...');
        
        if (!elementInfo.error) {
            // Scroll to services section and take screenshot
            await page.evaluate(() => {
                const container = document.querySelector('.services-marquee-container');
                if (container) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            await page.waitForTimeout(1000);

            // Take full viewport screenshot
            await page.screenshot({ path: 'services_analysis_full.png' });

            // Take clipped screenshot of services area
            if (elementInfo.containerBounds) {
                const bounds = elementInfo.containerBounds;
                const padding = 100;
                await page.screenshot({
                    path: 'services_analysis_focused.png',
                    clip: {
                        x: Math.max(0, bounds.x - padding),
                        y: Math.max(0, bounds.y - padding),
                        width: Math.min(1920, bounds.width + (padding * 2)),
                        height: Math.min(1080, bounds.height + (padding * 2))
                    }
                });
            }
        }

        // 3. CHECK FOR FADE OVERLAYS
        console.log('🎨 Checking fade overlays...');
        const fadeOverlayInfo = await page.evaluate(() => {
            const container = document.querySelector('.services-marquee-container');
            if (!container) return { error: 'Container not found' };

            const containerStyles = getComputedStyle(container);
            const beforeStyles = getComputedStyle(container, '::before');
            const afterStyles = getComputedStyle(container, '::after');

            return {
                container: {
                    position: containerStyles.position,
                    overflow: containerStyles.overflow,
                    width: containerStyles.width,
                    height: containerStyles.height
                },
                beforeOverlay: {
                    content: beforeStyles.content,
                    display: beforeStyles.display,
                    position: beforeStyles.position,
                    background: beforeStyles.background,
                    width: beforeStyles.width,
                    height: beforeStyles.height,
                    left: beforeStyles.left,
                    top: beforeStyles.top,
                    zIndex: beforeStyles.zIndex,
                    isActive: beforeStyles.content !== 'none' && beforeStyles.content !== '""'
                },
                afterOverlay: {
                    content: afterStyles.content,
                    display: afterStyles.display,
                    position: afterStyles.position,
                    background: afterStyles.background,
                    width: afterStyles.width,
                    height: afterStyles.height,
                    right: afterStyles.right,
                    top: afterStyles.top,
                    zIndex: afterStyles.zIndex,
                    isActive: afterStyles.content !== 'none' && afterStyles.content !== '""'
                }
            };
        });

        console.log('🎨 Fade overlay analysis:', JSON.stringify(fadeOverlayInfo, null, 2));

        // 4. READABLE ANALYSIS REPORT
        const report = {
            timestamp: new Date().toISOString(),
            url: page.url(),
            analysis: {
                elementsDetected: elementInfo,
                fadeOverlays: fadeOverlayInfo,
                issues: [],
                recommendations: []
            }
        };

        // Analyze issues
        if (elementInfo.error) {
            report.analysis.issues.push({
                severity: 'HIGH',
                issue: 'Services carousel container not found',
                description: 'Cannot locate .services-marquee-container element'
            });
        } else {
            // Check if service cards are found
            if (!elementInfo.serviceCards.count || elementInfo.serviceCards.count === 0) {
                report.analysis.issues.push({
                    severity: 'HIGH',
                    issue: 'No service cards detected',
                    description: 'No service cards found in the carousel',
                    suggestion: 'Check if service cards have the expected CSS classes'
                });
            }

            // Check text readability
            if (elementInfo.serviceCards.cards) {
                elementInfo.serviceCards.cards.forEach((card, index) => {
                    card.textContent.forEach((text, textIndex) => {
                        const fontSize = parseFloat(text.fontSize);
                        const opacity = parseFloat(text.opacity);
                        
                        if (fontSize < 14) {
                            report.analysis.issues.push({
                                severity: 'MEDIUM',
                                issue: `Small text size on card ${index + 1}`,
                                description: `Text "${text.text.substring(0, 30)}..." is only ${text.fontSize}`,
                                suggestion: 'Consider increasing font size to at least 14px'
                            });
                        }
                        
                        if (opacity < 0.8) {
                            report.analysis.issues.push({
                                severity: 'MEDIUM',
                                issue: `Low opacity text on card ${index + 1}`,
                                description: `Text opacity is ${opacity}, may be hard to read`,
                                suggestion: 'Increase opacity to at least 0.8 for better readability'
                            });
                        }
                    });
                });
            }

            // Check fade overlays
            if (!fadeOverlayInfo.beforeOverlay.isActive && !fadeOverlayInfo.afterOverlay.isActive) {
                report.analysis.issues.push({
                    severity: 'MEDIUM',
                    issue: 'Fade overlays not detected',
                    description: 'CSS pseudo-elements ::before and ::after are not active',
                    suggestion: 'Check if fade overlay CSS is properly applied'
                });
            }
        }

        // Save report
        fs.writeFileSync('services_analysis_report.json', JSON.stringify(report, null, 2));
        
        // Generate human readable summary
        let summary = `# 🔍 Services Carousel Analysis Report\n\n`;
        summary += `**Generated:** ${report.timestamp}\n`;
        summary += `**URL:** ${report.url}\n\n`;
        
        summary += `## 📋 Quick Summary\n`;
        if (report.analysis.issues.length === 0) {
            summary += `✅ **No issues detected** - Services carousel looks good!\n\n`;
        } else {
            const highIssues = report.analysis.issues.filter(i => i.severity === 'HIGH').length;
            const mediumIssues = report.analysis.issues.filter(i => i.severity === 'MEDIUM').length;
            summary += `⚠️ **${report.analysis.issues.length} issues detected** (${highIssues} high priority, ${mediumIssues} medium priority)\n\n`;
        }

        summary += `## 🔍 Detailed Findings\n\n`;

        if (elementInfo.error) {
            summary += `❌ **CRITICAL**: ${elementInfo.error}\n\n`;
        } else {
            summary += `✅ **Services Container**: Found and analyzed\n`;
            summary += `- Dimensions: ${elementInfo.containerBounds.width}px × ${elementInfo.containerBounds.height}px\n`;
            summary += `- Overflow: ${elementInfo.containerStyles.overflowX}\n\n`;

            summary += `📦 **Service Cards**: ${elementInfo.serviceCards.count} found using selector "${elementInfo.serviceCards.foundSelector}"\n\n`;

            if (elementInfo.serviceCards.cards && elementInfo.serviceCards.cards.length > 0) {
                summary += `## 🎯 Individual Card Analysis\n\n`;
                elementInfo.serviceCards.cards.forEach((card, index) => {
                    summary += `**Card ${index + 1}**:\n`;
                    summary += `- Position: (${Math.round(card.bounds.x)}, ${Math.round(card.bounds.y)})\n`;
                    summary += `- Size: ${Math.round(card.bounds.width)}px × ${Math.round(card.bounds.height)}px\n`;
                    summary += `- Visible: ${card.bounds.isVisible ? '✅' : '❌'}\n`;
                    summary += `- In Viewport: ${card.bounds.isInViewport ? '✅' : '❌'}\n`;
                    
                    if (card.textContent.length > 0) {
                        summary += `- Text Elements: ${card.textContent.length}\n`;
                        card.textContent.forEach((text, textIndex) => {
                            const readableSize = parseFloat(text.fontSize) >= 14;
                            const readableOpacity = parseFloat(text.opacity) >= 0.8;
                            summary += `  - "${text.text.substring(0, 30)}${text.text.length > 30 ? '...' : ''}" (${text.fontSize}, opacity: ${text.opacity}) ${readableSize && readableOpacity ? '✅' : '⚠️'}\n`;
                        });
                    }
                    summary += `\n`;
                });
            }
        }

        summary += `## 🎨 Fade Overlay Status\n\n`;
        if (fadeOverlayInfo.beforeOverlay.isActive || fadeOverlayInfo.afterOverlay.isActive) {
            summary += `✅ **Fade overlays detected**\n`;
            if (fadeOverlayInfo.beforeOverlay.isActive) {
                summary += `- Left overlay (::before): Active\n`;
                summary += `  - Background: ${fadeOverlayInfo.beforeOverlay.background}\n`;
            }
            if (fadeOverlayInfo.afterOverlay.isActive) {
                summary += `- Right overlay (::after): Active\n`;
                summary += `  - Background: ${fadeOverlayInfo.afterOverlay.background}\n`;
            }
        } else {
            summary += `❌ **No fade overlays detected**\n`;
            summary += `This might explain why carousel edges look cut off\n`;
        }

        summary += `\n## 🔧 Issues & Recommendations\n\n`;
        if (report.analysis.issues.length === 0) {
            summary += `🎉 **No issues found!** Your services carousel is working well.\n`;
        } else {
            report.analysis.issues.forEach((issue, index) => {
                const icon = issue.severity === 'HIGH' ? '🚨' : '⚠️';
                summary += `${icon} **${issue.issue}** (${issue.severity})\n`;
                summary += `${issue.description}\n`;
                if (issue.suggestion) {
                    summary += `💡 *Suggestion: ${issue.suggestion}*\n`;
                }
                summary += `\n`;
            });
        }

        fs.writeFileSync('services_analysis_summary.md', summary);

        console.log('\n🎉 Analysis complete!');
        console.log('📁 Files generated:');
        console.log('  - services_analysis_full.png (full viewport)');
        console.log('  - services_analysis_focused.png (services area only)');
        console.log('  - services_analysis_report.json (detailed data)');
        console.log('  - services_analysis_summary.md (readable summary)');
        
        return report;

    } catch (error) {
        console.error('❌ Analysis failed:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the analysis
if (require.main === module) {
    analyzeServicesCarousel().then(() => {
        console.log('✅ Services carousel analysis completed');
        process.exit(0);
    }).catch((error) => {
        console.error('❌ Analysis script failed:', error);
        process.exit(1);
    });
}

module.exports = analyzeServicesCarousel;
