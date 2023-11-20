export let template = {
    content: [
        { text: 'Tables', style: 'header' },
        'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
        { text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
        'The following table has nothing more than a body array',
        {
            style: 'tableExample',
            table: {
                body: [
                    ['Column 1', 'Column 2', 'Column 3'],
                    ['One value goes here', 'Another one here', 'OK?']
                ]
            }
        },
    ],
    styles: {
        header : {
            fontSize: 18,
            bold: true,
            color: '#047886',
            alignment: 'center',
            
        }
    }

}


interface TemStyles {
    fontSize? : number,
    bold?: boolean,
    color?: string,
    alignment?: string

}