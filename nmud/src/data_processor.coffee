_ = require('underscore')

module.exports = (data)->
  data = _.reject(data.split(""), (item)->
    val = item.charCodeAt(0)
    return val < 32 || val > 126
  ).join("")

  data.replace(/\ /g, "&nbsp;")
