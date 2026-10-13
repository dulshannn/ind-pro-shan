// Resolves both admin-uploaded files and externally hosted catalogue photos.
export const imageUrl = (image) => {
    if (!image) return null;
    if (/^https?:\/\//i.test(image)) return image;

    const clean = image.replace(/\\/g, '/').replace(/^\/?uploads\//, '');
    return `/uploads/${clean}`;
};
