function pageNotFound() {
    return {
        index: (req, res, next) => {
            res.status(404).render('./404', {
                title: '404',
                routePath: '',
            });
        },
    };
}

module.exports = pageNotFound;
