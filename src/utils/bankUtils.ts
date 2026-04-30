// Definición de máscaras por banco
export const getMascaraCuenta = (banco: string) => {
    switch (banco) {
        case 'BCP':
            return '000-00000000-0-00';
        case 'BBVA':
            return '0000-0000-000000000000';
        case 'Interbank':
            return '000-0000000-0';
        case 'Scotiabank':
            return '000-0000000-00';
        case 'BanBif':
            return '000-00000000-0-00';
        case 'Banco de la Nación':
            return '0000-0000-0000000000';
        case 'Banco Pichincha':
            return '000-0000000-00';
        case 'Citibank':
            return '0000-000000-000000000000';
        case 'Mibanco':
            return '000-0000000-0';
        case 'Banco Falabella':
            return '000-0000000-0';
        case 'Banco Ripley':
            return '000-0000000-0';
        default:
            return '000-00000000-0-00';
    }
};

// Información detallada de bancos peruanos
export const bancos = [
    {
        value: 'BCP',
        label: 'BCP',
        icon: '🏛️',
        ejemplo: '191-12345678-1-23',
        formato: 'XXX-XXXXXXXX-X-XX'
    },
    {
        value: 'BBVA',
        label: 'BBVA',
        icon: '🏛️',
        ejemplo: '0011-1234-123456789012',
        formato: 'XXXX-XXXX-XXXXXXXXXXXX'
    },
    {
        value: 'Interbank',
        label: 'Interbank',
        icon: '🏛️',
        ejemplo: '123-1234567-1',
        formato: 'XXX-XXXXXXX-X'
    },
    {
        value: 'Scotiabank',
        label: 'Scotiabank',
        icon: '🏛️',
        ejemplo: '123-1234567-89',
        formato: 'XXX-XXXXXXX-XX'
    },
    {
        value: 'BanBif',
        label: 'BanBif',
        icon: '🏛️',
        ejemplo: '123-12345678-1-23',
        formato: 'XXX-XXXXXXXX-X-XX'
    },
    {
        value: 'Banco de la Nación',
        label: 'Banco de la Nación',
        icon: '🏛️',
        ejemplo: '1234-1234-1234567890',
        formato: 'XXXX-XXXX-XXXXXXXXXX'
    },
    {
        value: 'Banco Pichincha',
        label: 'Banco Pichincha',
        icon: '🏛️',
        ejemplo: '123-1234567-89',
        formato: 'XXX-XXXXXXX-XX'
    },
    {
        value: 'Citibank',
        label: 'Citibank',
        icon: '🏛️',
        ejemplo: '1234-123456-123456789012',
        formato: 'XXXX-XXXXXX-XXXXXXXXXXXX'
    },
    {
        value: 'Mibanco',
        label: 'Mibanco',
        icon: '🏛️',
        ejemplo: '123-1234567-1',
        formato: 'XXX-XXXXXXX-X'
    },
    {
        value: 'Banco Falabella',
        label: 'Banco Falabella',
        icon: '🏛️',
        ejemplo: '123-1234567-1',
        formato: 'XXX-XXXXXXX-X'
    },
    {
        value: 'Banco Ripley',
        label: 'Banco Ripley',
        icon: '🏛️',
        ejemplo: '123-1234567-1',
        formato: 'XXX-XXXXXXX-X'
    },
    {
        value: 'Alfin Banco',
        label: 'Alfin Banco',
        icon: '🏛️',
        ejemplo: '123-1234567-1',
        formato: 'XXX-XXXXXXX-X'
    },
    {
        value: 'Compartamos Financiera',
        label: 'Compartamos Financiera',
        icon: '🏛️',
        ejemplo: '123-1234567-1',
        formato: 'XXX-XXXXXXX-X'
    },
    {
        value: 'Crediscotia',
        label: 'Crediscotia',
        icon: '🏛️',
        ejemplo: '123-1234567-1',
        formato: 'XXX-XXXXXXX-X'
    },
    {
        value: 'Financiera Oh!',
        label: 'Financiera Oh!',
        icon: '🏛️',
        ejemplo: '123-1234567-1',
        formato: 'XXX-XXXXXXX-X'
    },
    {
        value: 'Qapaq',
        label: 'Qapaq',
        icon: '🏛️',
        ejemplo: '123-1234567-1',
        formato: 'XXX-XXXXXXX-X'
    }
];

export type Banco = typeof bancos[0];
