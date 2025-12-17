export const getDaysUntilExpiration = (expiresOn) => {
    if(!expiresOn) return null;
    const today = new Date();
    const expDate = new Date(expiresOn)
    return Math.ceil((expDate - today) / (1000 * 60 * 60 * 24))
};

export const getExpirationStatus = (expiresOn) => {
    const daysUntil = getDaysUntilExpiration(expiresOn);
    if (daysUntil === null) return null;
    if (daysUntil < 0) return 'badge-error';
    if (daysUntil <= 3) return 'badge-warning';
    return null;
};

export const getExpirationLabel = (expiresOn) => {
    const daysUntil = getDaysUntilExpiration(expiresOn);
    if (daysUntil === null) return {text: '', class: ''};
    if (daysUntil < 0) return {text: `${Math.abs(daysUntil)} days ago`, class: 'badge-error'};
    if (daysUntil === 0) return {text: 'Today', class: 'badge-error'};
    if (daysUntil === 1) return {text: 'Tomorrow', class: 'badge-warning'}
    if (daysUntil <= 7) return {text: `${daysUntil} days`, class: 'badge-warning'};
    return {text: `${daysUntil} days`, class: ''};
}; 