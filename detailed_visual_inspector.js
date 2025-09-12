const puppeteer = require('puppeteer');
const fs = require('fs');

class DetailedVisualInspector {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = {
            screenshots: [],
            measurements: {},
            styles: {},
            accessibility: {},
            performance: {},
            interactions: []
        };
    }

    async initialize() {
        this.browser = await puppeteer.launch({
            headless: false, // Show browser for debugging
            defaultViewport: null,
            args: ['--start-maximized', '--disable-web-security']
        });
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });
        
        // Enable console logging
        this.page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        
        console.log('🔍 Visual Inspector initialized');
    }

    async navigateAndWait(url) {
        console.log(`📍 Navigating to ${url}`);
        await this.page.goto(url, { waitUntil: 'networkidle2' });
        await this.page.waitForTimeout(2000); // Extra wait for animations
    }

    async takeDetailedScreenshots(selector = '.services-marquee-container') {
        console.log('📸 Taking detailed screenshots...');
        
        try {
            // Full page screenshot
            await this.page.screenshot({ 
                path: 'inspection_full_page.png', 
                fullPage: true 
            });
            console.log('✅ Full page screenshot saved');

            // Find the element and scroll to it
            const element = await this.page.$(selector);
            if (!element) {
                console.log(`❌ Element ${selector} not found`);
                return;
            }

            // Scroll element into view
            await this.page.evaluate((sel) => {
                const el = document.querySelector(sel);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, selector);

            await this.page.waitForTimeout(1000);

            // Get element bounding box
            const boundingBox = await element.boundingBox();
            console.log('📏 Element bounds:', boundingBox);

            // Take focused screenshot of the element with padding
            const padding = 50;
            await this.page.screenshot({
                path: 'inspection_services_focused.png',
                clip: {
                    x: Math.max(0, boundingBox.x - padding),
                    y: Math.max(0, boundingBox.y - padding),
                    width: Math.min(1920, boundingBox.width + (padding * 2)),
                    height: Math.min(1080, boundingBox.height + (padding * 2))
                }
            });
            console.log('✅ Focused screenshot saved');

            // Take multiple state screenshots
            await this.captureStatesScreenshots(selector);
            
        } catch (error) {
            console.error('❌ Screenshot error:', error);
        }
    }

    async captureStatesScreenshots(selector) {
        console.log('🎬 Capturing different states...');

        // Before interaction state
        await this.page.screenshot({ path: 'inspection_state_default.png' });

        // Hover state (if hoverable elements exist)
        try {
            const hoverableElements = await this.page.$$(`${selector} .service-card, ${selector} button`);
            if (hoverableElements.length > 0) {
                await hoverableElements[0].hover();
                await this.page.waitForTimeout(500);
                await this.page.screenshot({ path: 'inspection_state_hover.png' });
                console.log('✅ Hover state captured');
            }
        } catch (e) {
            console.log('ℹ️ No hoverable elements found');
        }

        // Mobile viewport
        await this.page.setViewport({ width: 375, height: 812 });
        await this.page.waitForTimeout(1000);
        await this.page.screenshot({ path: 'inspection_mobile_view.png' });
        console.log('✅ Mobile view captured');

        // Tablet viewport  
        await this.page.setViewport({ width: 768, height: 1024 });
        await this.page.waitForTimeout(1000);
        await this.page.screenshot({ path: 'inspection_tablet_view.png' });
        console.log('✅ Tablet view captured');

        // Reset to desktop
        await this.page.setViewport({ width: 1920, height: 1080 });
        await this.page.waitForTimeout(1000);
    }

    async analyzeStyles(selector = '.services-marquee-container') {
        console.log('🎨 Analyzing styles in detail...');

        const styleAnalysis = await this.page.evaluate((sel) => {
            const container = document.querySelector(sel);
            if (!container) return { error: 'Container not found' };

            const getComputedStylesFor = (element, label) => {
                const computed = window.getComputedStyle(element);
                return {
                    label,
                    selector: element.tagName.toLowerCase() + (element.className ? `.${element.className.split(' ').join('.')}` : ''),
                    dimensions: {
                        width: computed.width,
                        height: computed.height,
                        paddingTop: computed.paddingTop,
                        paddingRight: computed.paddingRight,
                        paddingBottom: computed.paddingBottom,
                        paddingLeft: computed.paddingLeft,
                        marginTop: computed.marginTop,
                        marginRight: computed.marginRight,
                        marginBottom: computed.marginBottom,
                        marginLeft: computed.marginLeft
                    },
                    typography: {
                        fontSize: computed.fontSize,
                        fontFamily: computed.fontFamily,
                        fontWeight: computed.fontWeight,
                        lineHeight: computed.lineHeight,
                        letterSpacing: computed.letterSpacing,
                        textAlign: computed.textAlign,
                        color: computed.color
                    },
                    background: {
                        backgroundColor: computed.backgroundColor,
                        backgroundImage: computed.backgroundImage,
                        backgroundSize: computed.backgroundSize,
                        backgroundPosition: computed.backgroundPosition
                    },
                    borders: {
                        borderWidth: computed.borderWidth,
                        borderStyle: computed.borderStyle,
                        borderColor: computed.borderColor,
                        borderRadius: computed.borderRadius
                    },
                    effects: {
                        opacity: computed.opacity,
                        transform: computed.transform,
                        filter: computed.filter,
                        boxShadow: computed.boxShadow,
                        backdropFilter: computed.backdropFilter
                    },
                    positioning: {
                        position: computed.position,
                        zIndex: computed.zIndex,
                        top: computed.top,
                        right: computed.right,
                        bottom: computed.bottom,
                        left: computed.left
                    },
                    overflow: {
                        overflow: computed.overflow,
                        overflowX: computed.overflowX,
                        overflowY: computed.overflowY
                    }
                };
            };

            const analysis = {
                container: getComputedStylesFor(container, 'Services Container'),
                cards: [],
                overlays: []
            };

            // Analyze service cards
            const cards = container.querySelectorAll('.service-card, [class*="service"], [class*="card"]');
            cards.forEach((card, index) => {
                analysis.cards.push(getComputedStylesFor(card, `Service Card ${index + 1}`));
                
                // Check text elements within cards
                const textElements = card.querySelectorAll('h3, h4, p, span, div');
                textElements.forEach((textEl, textIndex) => {
                    if (textEl.textContent.trim()) {
                        analysis.cards[analysis.cards.length - 1][`text_element_${textIndex}`] = {
                            content: textEl.textContent.trim(),
                            ...getComputedStylesFor(textEl, `Text Element ${textIndex}`).typography
                        };
                    }
                });
            });

            // Check for fade overlays
            const overlays = container.querySelectorAll('::before, ::after');
            const beforeEl = container.querySelector(':before');
            const afterEl = container.querySelector(':after');
            
            // Try to detect pseudo-elements
            const containerStyles = window.getComputedStyle(container);
            const beforeStyles = window.getComputedStyle(container, '::before');
            const afterStyles = window.getComputedStyle(container, '::after');

            if (beforeStyles.content !== 'none') {
                analysis.overlays.push({
                    type: '::before (left fade)',
                    background: beforeStyles.background,
                    width: beforeStyles.width,
                    height: beforeStyles.height,
                    position: beforeStyles.position,
                    zIndex: beforeStyles.zIndex
                });
            }

            if (afterStyles.content !== 'none') {
                analysis.overlays.push({
                    type: '::after (right fade)',
                    background: afterStyles.background,
                    width: afterStyles.width,
                    height: afterStyles.height,
                    position: afterStyles.position,
                    zIndex: afterStyles.zIndex
                });
            }

            return analysis;
        }, selector);

        this.results.styles = styleAnalysis;
        console.log('✅ Style analysis complete');
        return styleAnalysis;
    }

    async measureReadability(selector = '.services-marquee-container') {
        console.log('👓 Measuring text readability...');

        const readabilityAnalysis = await this.page.evaluate((sel) => {
            const container = document.querySelector(sel);
            if (!container) return { error: 'Container not found' };

            // Function to calculate contrast ratio
            const getContrastRatio = (color1, color2) => {
                const getLuminance = (color) => {
                    const rgb = color.match(/\d+/g).map(Number);
                    const [r, g, b] = rgb.map(c => {
                        c = c / 255;
                        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                    });
                    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
                };

                const l1 = getLuminance(color1);
                const l2 = getLuminance(color2);
                const lighter = Math.max(l1, l2);
                const darker = Math.min(l1, l2);
                return (lighter + 0.05) / (darker + 0.05);
            };

            const textElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a');
            const readabilityResults = [];

            textElements.forEach((el, index) => {
                if (!el.textContent.trim()) return;

                const computed = window.getComputedStyle(el);
                const textColor = computed.color;
                const backgroundColor = computed.backgroundColor;
                const fontSize = parseFloat(computed.fontSize);
                const fontWeight = computed.fontWeight;

                // Get actual background color (might be from parent)
                let actualBgColor = backgroundColor;
                if (actualBgColor === 'rgba(0, 0, 0, 0)' || actualBgColor === 'transparent') {
                    let parent = el.parentElement;
                    while (parent && parent !== document.body) {
                        const parentBg = window.getComputedStyle(parent).backgroundColor;
                        if (parentBg !== 'rgba(0, 0, 0, 0)' && parentBg !== 'transparent') {
                            actualBgColor = parentBg;
                            break;
                        }
                        parent = parent.parentElement;
                    }
                    if (actualBgColor === 'rgba(0, 0, 0, 0)' || actualBgColor === 'transparent') {
                        actualBgColor = 'rgb(255, 255, 255)'; // Default to white
                    }
                }

                let contrastRatio = 1;
                try {
                    contrastRatio = getContrastRatio(textColor, actualBgColor);
                } catch (e) {
                    contrastRatio = 1;
                }

                const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
                const wcagAAPass = isLargeText ? contrastRatio >= 3 : contrastRatio >= 4.5;
                const wcagAAAPass = isLargeText ? contrastRatio >= 4.5 : contrastRatio >= 7;

                readabilityResults.push({
                    element: el.tagName.toLowerCase(),
                    text: el.textContent.trim().substring(0, 50) + '...',
                    fontSize: `${fontSize}px`,
                    fontWeight,
                    textColor,
                    backgroundColor: actualBgColor,
                    contrastRatio: contrastRatio.toFixed(2),
                    wcagAA: wcagAAPass ? 'PASS' : 'FAIL',
                    wcagAAA: wcagAAAPass ? 'PASS' : 'FAIL',
                    isLargeText,
                    readabilityScore: contrastRatio >= 7 ? 'Excellent' : 
                                   contrastRatio >= 4.5 ? 'Good' : 
                                   contrastRatio >= 3 ? 'Fair' : 'Poor'
                });
            });

            return readabilityResults;
        }, selector);

        this.results.accessibility = readabilityAnalysis;
        console.log('✅ Readability analysis complete');
        return readabilityAnalysis;
    }

    async measurePerformance() {
        console.log('⚡ Measuring performance metrics...');

        const metrics = await this.page.metrics();
        const performanceTimingJson = await this.page.evaluate(() => {
            return JSON.stringify(window.performance.timing);
        });
        const performanceTiming = JSON.parse(performanceTimingJson);

        const performanceAnalysis = {
            metrics,
            timing: performanceTiming,
            loadTime: performanceTiming.loadEventEnd - performanceTiming.navigationStart,
            domContentLoadedTime: performanceTiming.domContentLoadedEventEnd - performanceTiming.navigationStart,
            firstPaintTime: performanceTiming.responseStart - performanceTiming.navigationStart
        };

        this.results.performance = performanceAnalysis;
        console.log('✅ Performance analysis complete');
        return performanceAnalysis;
    }

    async testInteractions(selector = '.services-marquee-container') {
        console.log('🎯 Testing interactions...');

        const interactionResults = [];

        try {
            // Test scrolling behavior
            const initialScrollPos = await this.page.evaluate(() => window.scrollY);
            
            await this.page.evaluate(() => {
                window.scrollBy(0, 100);
            });
            
            await this.page.waitForTimeout(100);
            const newScrollPos = await this.page.evaluate(() => window.scrollY);
            
            interactionResults.push({
                type: 'scroll',
                working: newScrollPos !== initialScrollPos,
                details: `Scrolled from ${initialScrollPos} to ${newScrollPos}`
            });

            // Test hover effects on service cards
            const hoverableElements = await this.page.$$(`${selector} *[class*="card"], ${selector} button`);
            
            for (let i = 0; i < Math.min(hoverableElements.length, 3); i++) {
                const element = hoverableElements[i];
                
                // Get styles before hover
                const beforeHover = await element.evaluate(el => {
                    const computed = window.getComputedStyle(el);
                    return {
                        transform: computed.transform,
                        opacity: computed.opacity,
                        backgroundColor: computed.backgroundColor,
                        boxShadow: computed.boxShadow
                    };
                });

                // Hover
                await element.hover();
                await this.page.waitForTimeout(300);

                // Get styles after hover
                const afterHover = await element.evaluate(el => {
                    const computed = window.getComputedStyle(el);
                    return {
                        transform: computed.transform,
                        opacity: computed.opacity,
                        backgroundColor: computed.backgroundColor,
                        boxShadow: computed.boxShadow
                    };
                });

                const hasHoverEffect = JSON.stringify(beforeHover) !== JSON.stringify(afterHover);

                interactionResults.push({
                    type: 'hover',
                    element: `Element ${i + 1}`,
                    working: hasHoverEffect,
                    beforeHover,
                    afterHover,
                    details: hasHoverEffect ? 'Hover effect detected' : 'No hover effect'
                });
            }

        } catch (error) {
            interactionResults.push({
                type: 'error',
                details: error.message
            });
        }

        this.results.interactions = interactionResults;
        console.log('✅ Interaction testing complete');
        return interactionResults;
    }

    async generateDetailedReport() {
        console.log('📊 Generating detailed report...');

        const report = {
            timestamp: new Date().toISOString(),
            url: this.page.url(),
            viewport: await this.page.viewport(),
            ...this.results
        };

        // Save detailed report
        fs.writeFileSync('detailed_inspection_report.json', JSON.stringify(report, null, 2));
        
        // Generate human-readable summary
        const summary = this.generateHumanReadableSummary(report);
        fs.writeFileSync('inspection_summary.md', summary);

        console.log('✅ Reports generated:');
        console.log('   📄 detailed_inspection_report.json');
        console.log('   📄 inspection_summary.md');
        
        return report;
    }

    generateHumanReadableSummary(report) {
        let summary = `# 🔍 Detailed Visual Inspection Report\n\n`;
        summary += `**Generated:** ${report.timestamp}\n`;
        summary += `**URL:** ${report.url}\n`;
        summary += `**Viewport:** ${report.viewport.width}x${report.viewport.height}\n\n`;

        // Screenshots section
        summary += `## 📸 Screenshots Captured\n`;
        summary += `- ✅ Full page screenshot\n`;
        summary += `- ✅ Focused services section\n`;
        summary += `- ✅ Mobile view (375px)\n`;
        summary += `- ✅ Tablet view (768px)\n`;
        summary += `- ✅ Desktop view (1920px)\n\n`;

        // Style analysis
        if (report.styles && !report.styles.error) {
            summary += `## 🎨 Style Analysis\n`;
            summary += `**Services Container:**\n`;
            if (report.styles.container) {
                const container = report.styles.container;
                summary += `- Dimensions: ${container.dimensions.width} x ${container.dimensions.height}\n`;
                summary += `- Background: ${container.background.backgroundColor}\n`;
                summary += `- Overflow: ${container.overflow.overflow}\n`;
            }

            summary += `\n**Service Cards Found:** ${report.styles.cards ? report.styles.cards.length : 0}\n`;
            
            if (report.styles.overlays && report.styles.overlays.length > 0) {
                summary += `\n**Fade Overlays Detected:**\n`;
                report.styles.overlays.forEach(overlay => {
                    summary += `- ${overlay.type}: ${overlay.background}\n`;
                });
            } else {
                summary += `\n⚠️ **No fade overlays detected** - This might explain visual issues\n`;
            }
        }

        // Readability analysis
        if (report.accessibility && Array.isArray(report.accessibility)) {
            summary += `\n## 👓 Readability Analysis\n`;
            
            const readabilityStats = {
                total: report.accessibility.length,
                wcagAA: report.accessibility.filter(item => item.wcagAA === 'PASS').length,
                wcagAAA: report.accessibility.filter(item => item.wcagAAA === 'PASS').length,
                poor: report.accessibility.filter(item => item.readabilityScore === 'Poor').length
            };

            summary += `**Overall Readability:**\n`;
            summary += `- Total text elements: ${readabilityStats.total}\n`;
            summary += `- WCAG AA compliance: ${readabilityStats.wcagAA}/${readabilityStats.total} (${((readabilityStats.wcagAA/readabilityStats.total)*100).toFixed(1)}%)\n`;
            summary += `- WCAG AAA compliance: ${readabilityStats.wcagAAA}/${readabilityStats.total} (${((readabilityStats.wcagAAA/readabilityStats.total)*100).toFixed(1)}%)\n`;
            
            if (readabilityStats.poor > 0) {
                summary += `\n⚠️ **${readabilityStats.poor} elements have poor readability**\n`;
                
                const poorElements = report.accessibility.filter(item => item.readabilityScore === 'Poor');
                poorElements.forEach(item => {
                    summary += `   - ${item.element}: "${item.text}" (Contrast: ${item.contrastRatio})\n`;
                });
            }
        }

        // Performance metrics
        if (report.performance) {
            summary += `\n## ⚡ Performance Metrics\n`;
            summary += `- Load time: ${report.performance.loadTime}ms\n`;
            summary += `- DOM ready: ${report.performance.domContentLoadedTime}ms\n`;
            summary += `- JS heap used: ${(report.performance.metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB\n`;
        }

        // Interactions
        if (report.interactions && report.interactions.length > 0) {
            summary += `\n## 🎯 Interaction Testing\n`;
            report.interactions.forEach(interaction => {
                const status = interaction.working ? '✅' : '❌';
                summary += `${status} **${interaction.type}**: ${interaction.details}\n`;
            });
        }

        summary += `\n## 🔧 Recommendations\n`;
        
        // Generate recommendations based on findings
        const recommendations = [];
        
        if (report.styles && report.styles.overlays && report.styles.overlays.length === 0) {
            recommendations.push("🎨 **Fade overlays not detected** - Check if CSS pseudo-elements are properly applied");
        }
        
        if (report.accessibility && Array.isArray(report.accessibility)) {
            const poorReadability = report.accessibility.filter(item => item.readabilityScore === 'Poor');
            if (poorReadability.length > 0) {
                recommendations.push(`👓 **Improve text contrast** - ${poorReadability.length} elements fail readability standards`);
            }
        }

        if (recommendations.length === 0) {
            recommendations.push("✨ **Looking good!** - No major issues detected");
        }

        recommendations.forEach(rec => summary += `- ${rec}\n`);

        return summary;
    }

    async runCompleteInspection(url = 'http://localhost:3001/#services') {
        try {
            await this.initialize();
            await this.navigateAndWait(url);
            
            console.log('🚀 Starting complete inspection...\n');
            
            // Run all inspections in parallel where possible
            await Promise.all([
                this.takeDetailedScreenshots(),
                this.analyzeStyles(),
                this.measureReadability(),
                this.measurePerformance()
            ]);
            
            // Test interactions (needs to be sequential)
            await this.testInteractions();
            
            // Generate final report
            const report = await this.generateDetailedReport();
            
            console.log('\n🎉 Inspection complete!');
            console.log('📁 Check the following files:');
            console.log('   - inspection_*.png (screenshots)');
            console.log('   - detailed_inspection_report.json');
            console.log('   - inspection_summary.md');
            
            return report;
            
        } catch (error) {
            console.error('❌ Inspection failed:', error);
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Export for use
module.exports = DetailedVisualInspector;

// Run if called directly
if (require.main === module) {
    const inspector = new DetailedVisualInspector();
    inspector.runCompleteInspection().then(() => {
        console.log('✅ Inspection script completed');
        process.exit(0);
    }).catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
}
