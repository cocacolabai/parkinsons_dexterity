'use strict';

app.factory('ReporterService', () => {

    const styles = {
        documentTitle: {
            fontSize: 20,
            bold: true,
            alignment: 'left'
        },
        sectionTitle: {
            fontSize: 16,
            bold: true,
            alignment: 'left',
            margin: [0, 20, 0, 5] //[left, top, right, bottom]
        },
        sectionSubTitle: {
            fontSize: 14,
            bold: true,
            alignment: 'left',
            margin: [0, 5, 0, 5] //[left, top, right, bottom]  
        },
        sectionContent: {
            fontSize: 12,
            bold: false,
            alignment: 'left'
        }
    }


    const generateReport = (keyStrokes, keyPairs, statistics, metadata) => {

        console.log(statistics);

        
        let content = [];

        // Title
        content.push(generateReportTitle("Dexterity Performance Experiment"));
        
        // Section - Metadata
        content.push(generateSectionTitle("Metadata"));
        content.push(generateSectionContentForMetadata(metadata));

        // Section - Experiment Results

        // Section - Experiment Stats - Response Time
        content.push(generateSectionTitle("Experiment Statistics"));
        content.push(generateSectionSubTitle("Response Times (miliseconds)"));
        content.push(generateSectionContentForResponseTimes(statistics.responseTimeStats));

        // Section - Experiment Stats - Target Key Accuracy
        content.push(generateSectionSubTitle("Target Key Accuracy"));
        content.push(generateSectionContentForKeyAccuracy(statistics.keyAccuracyStats));


        // Generate PDF
        pdfMake.createPdf({ content, styles }).download("experiment_output");

        /*
            Raw Data (csv)
            - keyStrokes
            - keyPairs
        */
    }

    const generateSectionContentForKeyAccuracy = (stats) => {
        const { allKeys, firstKey, secondKey } = stats;
        const metrics = ['hits', 'miss', 'total'];

        return {
            // style: 'tableExample',
            table: {
                widths: ['*', '*', '*', '*'],
                layout: 'lightHorizontalLines',
                headerRows: 1,
                body: [
                    ['Count', 'Both Keys', 'First Key', 'Second Key'],
                    [
                        { stack: metrics, style: ['sectionContent']},
                        { stack: _.map(metrics, (m) => allKeys[m]), style: ['sectionContent']},
                        { stack: _.map(metrics, (m) => firstKey[m]), style: ['sectionContent']},
                        { stack: _.map(metrics, (m) => secondKey[m]), style: ['sectionContent']}
                    ]
                ]
            }
        };

    }

    const generateSectionContentForResponseTimes = (stats) => {

        const fromFirstKey  = stats.firstToSecondKeyResponseTimeStats;
        const fromSecondKey = stats.secondToFirstKeyResponseTimeStats;
        const total = stats.totalResponseTimeStats;
        const metrics = ['standardDeviation','variance','interquartileRange','mean','mode','min','max'];

        return {
            // style: 'tableExample',
            table: {
                widths: ['*', '*', '*', '*'],
                layout: 'lightHorizontalLines',
                headerRows: 1,
                body: [
                    ['Statistic', 'Total (bidirectional)', 'First -> Second Key', 'Second -> First Key'],
                    [
                        { stack: metrics, style: ['sectionContent']},
                        generateDescriptiveStatsContent(total, metrics),
                        generateDescriptiveStatsContent(fromFirstKey, metrics),
                        generateDescriptiveStatsContent(fromSecondKey, metrics)
                    ]
                ]
            }
        };
    }

    const generateDescriptiveStatsContent = (stats, metrics) => {
        const content = _.map(metrics, (metric) => stats[metric]);
        return { stack: content, style: ['sectionContent'] };
    }

    const generateSectionContentForMetadata = (metadata) => {
        let content = [];
        content.push(`Experiment ID: ${metadata.id}`);
        content.push(`Experiment Date: ${new Date()}`);
        content.push(`Participant Name: ${metadata.name}`);
        content.push(`Duration: ${metadata.duration}s`);
        content.push(`First Key: ${metadata.key_left}`);
        content.push(`Second Key: ${metadata.key_right}`);
        content.push(`Keyboard Rotation: ${metadata.rotation}`);
        return { stack: content, style: ['sectionContent'] };
    }


    const generatePDF = (fileName, content, styles) => {
        pdfMake.createPdf({ content, styles }).download(fileName);
    }



    /* Document Content Formatters */
    const generateReportTitle = (text) => ({ text, style: ['documentTitle'] });

    const generateSectionTitle = (text) => ({ text, style: ['sectionTitle'] });

    const generateSectionSubTitle = (text) => ({ text, style: ['sectionSubTitle'] });



    return { generateReport };
});