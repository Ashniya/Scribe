export const createSlug = (title, id) => {
    if (!title) return '';
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    // Use last 6 chars of MongoDB ObjectId for uniqueness without polluting the URL
    return `${slug}${id ? `-${id.slice(-6)}` : ''}`;
};

export const extractIdFromSlug = (slug) => {
    if (!slug) return '';
    return slug.split('-').pop();
};
