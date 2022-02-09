module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  },

  apiErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      const { name, message } = err
      res.status(500).json({
        status: name,
        message: `${name}: ${message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: err
      })
    }
    next(err)
  }
}
