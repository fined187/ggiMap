var Measure = function (buttons) {
  this.$btnDistance = buttons.distance
  this.$btnArea = buttons.area

  this._mode = null

  this._bindDOMEvents()
}
$.extend(Measure.prototype, {
  constructor: Measure,

  setMap: function (map) {
    if (this.map) {
      this._unbindMap(this.map)
    }

    this.map = map

    if (map) {
      this._bindMap(map)
    }
  },

  startMode: function (mode) {
    if (!mode) return

    if (mode === 'distance') {
      this._startDistance()
    }
    if (mode === 'area') {
      this._startArea()
    }
  },

  _startDistance: function () {
    var map = this.map

    this._distanceListeners = [
      naver.maps.Event.addListener(
        map,
        'click',
        this._onClickDistance.bind(this),
      ),
    ]

    map.setCursor("url('" + HOME_PATH + "/img/rule.cur'), default")
  },

  _startArea: function () {
    var map = this.map

    this._areaListeners = [
      naver.maps.Event.addListener(map, 'click', this._onClickArea.bind(this)),
      naver.maps.Event.addListener(
        map,
        'rightclick',
        this._finishArea.bind(this),
      ),
    ]

    $(document).on('mousemove.measure', this._onMouseMoveArea.bind(this))

    map.setCursor("url('" + HOME_PATH + "/img/area.cur'), default")
  },

  _finishDistance: function () {
    naver.maps.Event.removeListener(this._distanceListeners)
    delete this._distanceListeners

    $(document).off('mousemove.measure')

    if (this._guideline) {
      this._guideline.setMap(null)
      delete this._guideline
    }

    if (this._polyline) {
      var path = this._polyline.getPath(),
        lastCoord = path.getAt(path.getLength() - 1),
        distance = this._polyline.getDistance()
      // 폴리라인의 거리를 미터 단위로 반환합니다.

      delete this._polyline

      if (lastCoord) {
        this._addMileStone(lastCoord, this._fromMetersToText(distance), {
          'font-size': '14px',
          'font-weight': 'bold',
          color: '#f00',
        })
      }
    }

    this.$btnDistance.removeClass('control-on').blur()

    map.setCursor('auto')

    delete this._lastDistance
    this._mode = null
  },

  _finishArea: function () {
    naver.maps.Event.removeListener(this._areaListeners)
    delete this._areaListeners

    $(document).off('mousemove.measure')

    if (this._polygon) {
      var path = this._polygon.getPath()
      path.pop()

      // 폴리곤의 면적을 제곱미터 단위로 반환합니다.
      var squarMeters = this._polygon.getAreaSize(),
        lastCoord = path.getAt(path.getLength() - 1)

      if (lastCoord) {
        this._addMileStone(
          lastCoord,
          this._fromSquareMetersToText(squarMeters),
          {
            'font-size': '14px',
            'font-weight': 'bold',
            color: '#00f',
          },
        )
      }

      delete this._polygon
    }

    this.$btnArea.removeClass('control-on').blur()

    map.setCursor('auto')

    this._mode = null
  },

  finishMode: function (mode) {
    if (!mode) return

    if (mode === 'distance') {
      this._finishDistance()
    }
    if (mode === 'area') {
      this._finishArea()
    }
  },

  _fromMetersToText: function (meters) {
    meters = meters || 0

    var km = 1000,
      text = meters

    if (meters >= km) {
      text = parseFloat((meters / km).toFixed(1)) + 'km'
    } else {
      text = parseFloat(meters.toFixed(1)) + 'm'
    }

    return text
  },

  _fromSquareMetersToText: function (squarMeters) {
    squarMeters = squarMeters || 0

    var squarKm = 1000 * 1000,
      text = squarMeters

    if (squarMeters >= squarKm) {
      text = parseFloat((squarMeters / squarKm).toFixed(1)) + 'km<sup>2</sup>'
    } else {
      text = parseFloat(squarMeters.toFixed(1)) + 'm<sup>2</sup>'
    }

    return text
  },

  _addMileStone: function (coord, text, css) {
    if (!this._ms) this._ms = []

    var ms = new naver.maps.Marker({
      position: coord,
      icon: {
        content:
          '<div style="display:inline-block;padding:5px;text-align:center;background-color:#fff;border:1px solid #000;"><span>' +
          text +
          '</span></div>',
        anchor: new naver.maps.Point(-5, -5),
      },
      map: this.map,
    })

    var msElement = $(ms.getElement())

    if (css) {
      msElement.css(css)
    } else {
      msElement.css('font-size', '11px')
    }

    this._ms.push(ms)
  },

  _onClickDistance: function (e) {
    var map = this.map,
      coord = e.coord

    if (!this._polyline) {
      // 임시로 보여줄 점선 폴리라인을 생성합니다.
      this._guideline = new naver.maps.Polyline({
        strokeColor: '#f00',
        strokeWeight: 5,
        strokeStyle: [4, 4],
        strokeOpacity: 0.6,
        path: [coord],
        map: map,
      })

      $(document).on('mousemove.measure', this._onMouseMoveDistance.bind(this))
      this._distanceListeners.push(
        naver.maps.Event.addListener(
          map,
          'rightclick',
          this._finishDistance.bind(this),
        ),
      )

      // 실제 거리재기에 사용되는 폴리라인을 생성합니다.
      this._polyline = new naver.maps.Polyline({
        strokeColor: '#f00',
        strokeWeight: 5,
        strokeOpacity: 0.8,
        path: [coord],
        map: map,
      })

      // 폴리라인의 거리를 미터 단위로 반환합니다.
      this._lastDistance = this._polyline.getDistance()
    } else {
      this._guideline.setPath([e.coord])
      this._polyline.getPath().push(coord)

      // 폴리라인의 거리를 미터 단위로 반환합니다.
      var distance = this._polyline.getDistance()

      this._addMileStone(
        coord,
        this._fromMetersToText(distance - this._lastDistance),
      )

      this._lastDistance = distance
    }
  },

  _onMouseMoveDistance: function (e) {
    var map = this.map,
      proj = this.map.getProjection(),
      coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY))
    path = this._guideline.getPath()

    if (path.getLength() === 2) {
      path.pop()
    }

    path.push(coord)
  },

  _onClickArea: function (e) {
    var map = this.map,
      coord = e.coord

    if (!this._polygon) {
      this._polygon = new naver.maps.Polygon({
        strokeColor: '#00f',
        strokeOpacity: 0.6,
        strokeWeight: 5,
        fillColor: '#00f',
        fillOpacity: 0.3,
        paths: [coord],
        map: map,
      })
    } else {
      this._polygon.getPath().push(coord)
    }
  },

  _onMouseMoveArea: function (e) {
    if (!this._polygon) return

    var map = this.map,
      proj = this.map.getProjection(),
      coord = proj.fromPageXYToCoord(new naver.maps.Point(e.pageX, e.pageY)),
      path = this._polygon.getPath()

    if (path.getLength() >= 2) {
      path.pop()
    }

    path.push(coord)
  },

  _bindMap: function (map) {},

  _unbindMap: function () {
    this.unbindAll()
  },

  _bindDOMEvents: function () {
    this.$btnDistance.on(
      'click.measure',
      this._onClickButton.bind(this, 'distance'),
    )
    this.$btnArea.on('click.measure', this._onClickButton.bind(this, 'area'))
  },

  _onClickButton: function (newMode, e) {
    e.preventDefault()

    var btn = $(e.target),
      map = this.map,
      mode = this._mode

    if (btn.hasClass('control-on')) {
      btn.removeClass('control-on')
    } else {
      btn.addClass('control-on')
    }

    this._clearMode(mode)

    if (mode === newMode) {
      this._mode = null
      return
    }

    this._mode = newMode

    this.startMode(newMode)
  },

  _clearMode: function (mode) {
    if (!mode) return

    if (mode === 'distance') {
      if (this._polyline) {
        this._polyline.setMap(null)
        delete this._polyline
      }

      this._finishDistance()

      if (this._ms) {
        for (var i = 0, ii = this._ms.length; i < ii; i++) {
          this._ms[i].setMap(null)
        }

        delete this._ms
      }
    } else if (mode === 'area') {
      if (this._polygon) {
        this._polygon.setMap(null)
        delete this._polygon
      }

      this._finishArea()
    }
  },
})

var map = new naver.maps.Map('map', {
  center: new naver.maps.LatLng(35.3657244, 127.1645619),
  zoom: 7,
})

var measures = new Measure({
  distance: $('#distance'),
  area: $('#area'),
})

measures.setMap(map)
