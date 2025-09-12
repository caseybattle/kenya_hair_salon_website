const puppeteer = require('puppeteer');
const fs = require('fs');

async function quickServicesCheck() {
    console.log('🔍 Quick services carousel check...');
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true, // Use headless mode for reliability
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        console.log('📍 Loading page...');
        await page.goto('http://localhost:3001/#services', { 
            waitUntil: 'domcontentloaded',
            timeout: 10000 
        });
        
        // Wait a moment for any animations
        await page.waitForTimeout(2000);
        
        console.log('🔍 Analyzing page structure...');
        const analysis = await page.evaluate(() => {
            // Get basic page info
            const title = document.title;
            const url = window.location.href;
            
            // Look for services container
            const servicesContainer = document.querySelector('.services-marquee-container');
            
            if (!servicesContainer) {
                return {
                    success: false,
                    error: 'Services container (.services-marquee-container) not found',
                    pageTitle: title,
                    pageUrl: url,
                    availableSelectors: Array.from(document.querySelectorAll('[class*="service"]')).map(el => el.className),
                    allClasses: Array.from(new Set(Array.from(document.querySelectorAll('*')).flatMap(el => el.className ? el.className.split(' ') : []))).filter(c => c).slice(0, 20)
                };
            }
            
            // Analyze the container
            const containerBounds = servicesContainer.getBoundingClientRect();
            const containerStyles = getComputedStyle(servicesContainer);
            
            // Look for service items within container
            const possibleItems = servicesContainer.querySelectorAll('div, section, article, .service, [class*="service"], [class*="card"]');
            const items = Array.from(possibleItems).filter(item => {
                const bounds = item.getBoundingClientRect();
                return bounds.width > 50 && bounds.height > 50; // Filter out tiny elements
            });
            
            // Analyze each item
            const itemAnalysis = items.slice(0, 5).map((item, index) => {
                const bounds = item.getBoundingClientRect();
                const styles = getComputedStyle(item);
                const text = item.textContent.trim();
                
                return {
                    index,
                    className: item.className,
                    tagName: item.tagName.toLowerCase(),
                    bounds: {
                        x: Math.round(bounds.x),
                        y: Math.round(bounds.y), 
                        width: Math.round(bounds.width),
                        height: Math.round(bounds.height)
                    },
                    text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
                    styles: {
                        backgroundColor: styles.backgroundColor,
                        opacity: styles.opacity,
                        transform: styles.transform !== 'none' ? styles.transform : 'none'
                    },
                    isVisible: bounds.width > 0 && bounds.height > 0,
                    isInViewport: bounds.x < window.innerWidth && bounds.x + bounds.width > 0
                };
            });
            
            return {
                success: true,
                pageTitle: title,
                pageUrl: url,
                container: {
                    found: true,
                    bounds: {
                        x: Math.round(containerBounds.x),
                        y: Math.round(containerBounds.y),
                        width: Math.round(containerBounds.width),
                        height: Math.round(containerBounds.height)
                    },
                    styles: {
                        overflow: containerStyles.overflow,
                        overflowX: containerStyles.overflowX,
                        position: containerStyles.position,
                        width: containerStyles.width,
                        height: containerStyles.height
                    }
                },
                items: {
                    totalFound: possibleItems.length,
                    analyzed: itemAnalysis.length,
                    details: itemAnalysis
                }
            };
        });
        
        console.log('📊 Analysis results:');
        console.log(JSON.stringify(analysis, null, 2));
        
        // Take screenshots
        console.log('📸 Taking screenshots...');
        await page.screenshot({ path: 'quick_services_full.png', fullPage: false });
        
        if (analysis.success && analysis.container) {
            // Scroll to services and take focused screenshot
            await page.evaluate(() => {
                const container = document.querySelector('.services-marquee-container');
                if (container) {
                    container.scrollIntoView({ behavior: 'instant', block: 'center' });
                }
            });
            await page.waitForTimeout(500);
            await page.screenshot({ path: 'quick_services_focused.png', fullPage: false });
        }
        
        // Save analysis report
        const report = {
            timestamp: new Date().toISOString(),
            ...analysis
        };
        
        fs.writeFileSync('quick_services_report.json', JSON.stringify(report, null, 2));
        
        // Generate summary
        let summary = `# Quick Services Carousel Check\n\n`;
        summary += `**Time:** ${report.timestamp}\n`;
        summary += `**URL:** ${report.pageUrl}\n\n`;
        
        if (analysis.success) {
            summary += `✅ **Container Found**: Services carousel container detected\n`;
            summary += `- Position: (${analysis.container.bounds.x}, ${analysis.container.bounds.y})\n`;
            summary += `- Size: ${analysis.container.bounds.width}px × ${analysis.container.bounds.height}px\n`;
            summary += `- Overflow: ${analysis.container.styles.overflowX}\n\n`;
            
            summary += `📦 **Items Found**: ${analysis.items.totalFound} potential service items\n`;
            summary += `**Analyzed**: ${analysis.items.analyzed} items\n\n`;
            
            if (analysis.items.details.length > 0) {
                summary += `## Item Details:\n\n`;
                analysis.items.details.forEach((item, index) => {
                    summary += `**Item ${index + 1}** (${item.tagName}.${item.className}):\n`;
                    summary += `- Position: (${item.bounds.x}, ${item.bounds.y})\n`;
                    summary += `- Size: ${item.bounds.width}px × ${item.bounds.height}px\n`;
                    summary += `- Visible: ${item.isVisible ? '✅' : '❌'}\n`;
                    summary += `- In viewport: ${item.isInViewport ? '✅' : '❌'}\n`;
                    if (item.text) {
                        summary += `- Text: "${item.text}"\n`;
                    }
                    summary += `\n`;
                });
            }
        } else {
            summary += `❌ **Error**: ${analysis.error}\n\n`;
            if (analysis.availableSelectors && analysis.availableSelectors.length > 0) {
                summary += `**Available service-related selectors found:**\n`;
                analysis.availableSelectors.slice(0, 10).forEach(selector => {
                    summary += `- .${selector}\n`;
                });
                summary += `\n`;
            }
            if (analysis.allClasses && analysis.allClasses.length > 0) {
                summary += `**Sample CSS classes on page:**\n`;
                analysis.allClasses.slice(0, 15).forEach(className => {
                    summary += `- .${className}\n`;
                });
                summary += `\n`;
            }
        }
        
        fs.writeFileSync('quick_services_summary.md', summary);
        
        console.log('\n🎉 Quick check complete!');
        console.log('📁 Generated files:');
        console.log('  - quick_services_full.png');
        console.log('  - quick_services_focused.png'); 
        console.log('  - quick_services_report.json');
        console.log('  - quick_services_summary.md');
        
        return analysis;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run if called directly
if (require.main === module) {
    quickServicesCheck().then(() => {
        console.log('✅ Quick services check completed');
        process.exit(0);
    }).catch((error) => {
        console.error('❌ Quick check failed:', error.message);
        process.exit(1);
    });
}

module.exports = quickServicesCheck;
