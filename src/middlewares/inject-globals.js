module.exports = function(req, res, next) {
    let engine = res.app.get('engine');
    let config = req.app.get('config');
    engine.addGlobal('config', config);
    engine.addGlobal('request', req);

    next();
};
