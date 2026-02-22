export const createSlug = (title, id) => {
    if (!title) return '';
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    return `${slug}${id ? `-${id}` : ''}`;
};

export const extractIdFromSlug = (slug) => {
    if (!slug) return '';
    return slug.split('-').pop();
};
