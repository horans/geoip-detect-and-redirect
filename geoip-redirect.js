/****************************************************
*  project: geoip detect and redirect               *
*  description: main script                         *
*  author: horans@gmail.com                         *
*  url: github.com/horans/geoip-detect-and-redirect *
*  update: 180730                                   *
****************************************************/
/* global $ _ */
// namespace
var gdnr = {
  delay: 2,
  path: '',
  current: {
    lang: '',
    navi: '',
    geoip: '',
    need: false
  },
  api: {
    // geoip: 'https://i.wondershare.com/api/v1/geoip/country',
    geoip: 'geoip-dummy.json',
    code: 'geoip-code.json',
    link: 'geoip-link.json',
    l10n: 'geoip-l10n.json',
    modal: 'geoip-modal.html'
  },
  language: {
    default: 'english',
    current: '',
    redirect: ''
  },
  pool: [],
  code: {},
  link: {},
  redirect: '',
  l10n: {}
}

// cancel and remember
// redirect
$('body').on('click', '.gdnr-cancel', function () {
  window.localStorage.setItem('gdnr-no', true)
})

// redirect
$('body').on('click', '.gdnr-confirm', function () {
  window.location.href = gdnr.redirect
})

// show modal
$('body').on('gdnr.get.modal', function () {
  setTimeout(function () {
    $('.gdnr-modal').modal('show')
  }, gdnr.delay * 1000)
})

// get modal
$('body').on('gdnr.need.redirect', function () {
  $.get(gdnr.path + gdnr.api.modal, function (res) {
    $('body').append(res)
    $('.gdnr-current').text(_.capitalize(gdnr.language.current))
    $('.gdnr-redirect').text(_.capitalize(gdnr.language.redirect))
    _.each(gdnr.link[gdnr.current.navi], function (o, k) {
      $('.gdnr-list').append('<li><a href="' + o + '">' + gdnr.code[k].label + '</a></li>')
    })
    $('.gdnr-more').tooltip({ container: 'body' })
    $('body').trigger('gdnr.get.modal')
  }).fail(function () {
    window.console.log('[gdnr] cannot find modal')
  })
})

// determine redirect
$('body').on('gdnr.check.navi', function () {
  var p = ''
  _.each(gdnr.code, function (o) { p += o.geoip + ',' })
  gdnr.pool = _.uniq(_.split(_.trim(_.replace(_.replace(p, / /g, ''), /,,/g, ','), ','), ','))
  var r = true

  if (_.indexOf(gdnr.pool, gdnr.current.geoip) < 0) {
    r = false
  } else {
    if ((gdnr.language.current !== gdnr.language.default) && (gdnr.language.current === gdnr.language.redirect)) r = false
  }

  if (gdnr.language.current === gdnr.language.default) {
    if (_.indexOf(gdnr.pool, gdnr.current.geoip) < 0) r = false
  } else {
    if (gdnr.language.current === gdnr.language.redirect) r = false
  }
  if (r) {
    gdnr.redirect = gdnr.link[gdnr.current.navi][gdnr.language.redirect]
    $('body').trigger('gdnr.need.redirect')
    console.log('[gdnr] redirect to ' + gdnr.language.redirect)
  } else {
    console.log('[gdnr] no need to redirect')
  }
})

// check navigation
$('body').on('gdnr.check.lang', function () {
  if (gdnr.link[gdnr.current.navi]) {
    $('body').trigger('gdnr.check.navi')
  } else {
    window.console.log('[gdnr] navigation not included')
  }
})

// check language
$('body').on('gdnr.get.link', function () {
  gdnr.language.current = _.findKey(gdnr.code, function (o) { return o.code === gdnr.current.lang })
  gdnr.language.redirect = _.findKey(gdnr.code, function (o) { return o.geoip.indexOf(gdnr.current.geoip) > -1 }) || gdnr.language.default
  if (gdnr.language.current) {
    $('body').trigger('gdnr.check.lang')
  } else {
    window.console.log('[gdnr] language not included')
  }
})

// get link
$('body').on('gdnr.get.code', function () {
  $.getJSON(gdnr.path + gdnr.api.link, function (res) {
    gdnr.link = res
    $('body').trigger('gdnr.get.link')
  }).fail(function () {
    window.console.log('[gdnr] cannot find link')
  })
})

// get code
$('body').on('gdnr.get.geoip', function () {
  $.getJSON(gdnr.path + gdnr.api.code, function (res) {
    gdnr.code = res
    $('body').trigger('gdnr.get.code')
  }).fail(function () {
    window.console.log('[gdnr] cannot find code')
  })
})

// get geoip
$('body').on('gdnr.get.navi', function () {
  var g = window.localStorage.getItem('gdnr-geoip')
  if (g) {
    gdnr.current.geoip = g
    $('body').trigger('gdnr.get.geoip')
  } else {
    $.getJSON(gdnr.api.geoip, function (res) {
      if (res && (res.code === 200)) {
        gdnr.current.geoip = res.data.country
        window.localStorage.setItem('gdnr-geoip', res.country_code)
        $('body').trigger('gdnr.get.geoip')
      } else {
        window.console.log('[gdnr] cannot find geoip')
      }
    }).fail(function () {
      window.console.log('[gdnr] cannot find geoip')
    })
  }
})

// get navigation
$('body').on('gdnr.get.lang', function () {
  gdnr.current.navi = $('main#body').data('nav')
  if (gdnr.current.navi) {
    $('body').trigger('gdnr.get.navi')
  } else {
    window.console.log('[gdnr] cannot find navigation')
  }
})

// get language
$('body').on('gdnr.get.path', function () {
  gdnr.current.lang = $('main#body').data('lan')
  if (gdnr.current.lang) {
    $('body').trigger('gdnr.get.lang')
  } else {
    window.console.log('[gdnr] cannot find language')
  }
})

// get path
$('body').on('gdnr.check.lodash', function () {
  gdnr.temp = {}
  gdnr.temp.scripts = document.getElementsByTagName('script')
  gdnr.temp.src = gdnr.temp.scripts[gdnr.temp.scripts.length - 1].src
  gdnr.path = gdnr.temp.src.substring(0, gdnr.temp.src.lastIndexOf('/') + 1)
  delete gdnr.temp

  $('body').trigger('gdnr.get.path')
})

// check lodash
$('body').on('gdnr.check.storage', function () {
  if (typeof _ === 'undefined') {
    window.console.log('[gdnr] cannot find lodash')
  } else {
    $('body').trigger('gdnr.check.lodash')
  }
})

// check jquery
$(function () {
  if (window.localStorage.getItem('gdnr-no')) {
    window.console.log('[gdnr] user canceled')
  } else {
    $('body').trigger('gdnr.check.storage')
  }
})
