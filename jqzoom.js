var App = App || {};

App.zoom = {

  /*
  * ========================================
  * @
  * ========================================
  */
  zooms: [],
  /*
  * ========================================
  * +
  * ========================================
  */
  create: function (el, target, options, mediator) {

    var id = this.zooms.length;

    this.zooms.push( new this._Zoom(id, el, target, options, mediator) );

    return this.zooms[id];

  },
  delete: function (id) {

    var deleted = this.zooms.splice[id, 1];

    return (deleted) ? true : false;

  }

};
/*
* ========================================
* -
* ========================================
*/
App.zoom._Zoom = function (id, el, target, options, mediator) {

  this.id = id;
  this.el = el;
  this.target = target;
  this.objects = {};

  // options
  this.target_autohide = options.target_autohide || false;
  this.target_substitute = options.target_substitute || false;
  this.target_min = options.target_min || false;

  this.initialize();

};
// + ========================================
App.zoom._Zoom.prototype.initialize = function () {

  var self = this;

  // set up css
  $(self.el).css('position', 'relative');

  // bind events
  $(this.el)
    .on('mouseenter', function (e) {
      self._hoverIn(self, e);
    })
    .on('mouseleave', function (e) {
      self._hoverOut(self, e);
    })
    .on('mousemove', function (e) {
      self._hoverMouseMove(self, e);
    });

};
// ==========================================
// - populate variables
// ==========================================
App.zoom._Zoom.prototype._populate = function (self) {

  var target = $(self.el),
      target_img = target.children('img');

  // target miniature
  self.objects.min = {
    el: 'target-min-id-'+self.id,
    width: (target_img.width() / target_img.data('width')) * $(self.target).width(),
    height: (target_img.height() / target_img.data('height')) * $(self.target).height()
  };
  // container
  self.objects.el = {
    width: target.width(),
    height: target.height()
  };

};
// ==========================================
// - binded events
// ==========================================
App.zoom._Zoom.prototype._hoverIn = function (self, e) {

  self._populate(self);
  if (self.target_autohide) {
    if (self.target_substitute) $(self.target_substitute).addClass('is-hidden');
    $(self.target).removeClass('is-hidden');
  }
  if ($(self.target_min)) {
    $(self.el).append('<div id="'+self.objects.min.el+'"></div>');
    $('#'+self.objects.min.el).css({ position: 'absolute', 'z-index': '9999', width: self.objects.min.width + 'px', height: self.objects.min.height + 'px', border: '1px solid #000'});
  } 
  $(self.target).css('background', 'url('+$(self.el).children('img').attr('src')+') transparent no-repeat');
  
}
App.zoom._Zoom.prototype._hoverOut = function (self, e) {
  if (self.target_autohide) {
    if (self.target_substitute) $(self.target_substitute).removeClass('is-hidden');
    if ($(self.target_min)) $('#'+self.objects.min.el).remove();
    $(self.target)
      .addClass('is-hidden')
      .css('background-image', 'none');
  }

}
App.zoom._Zoom.prototype._hoverMouseMove = function (self, e) {

  var mousepos = {
      x: (e.pageX - $(self.el).offset().left),
      y: (e.pageY - $(self.el).offset().top)
    };
  var targetpos = { 
    x: mousepos.x - self.objects.min.width/2,
    y: mousepos.y - self.objects.min.width/2
  };
  if (targetpos.x < 0) targetpos.x = 0;
  else if (targetpos.x + self.objects.min.width > self.objects.el.width) targetpos.x = self.objects.el.width - self.objects.min.width;
  if (targetpos.y < 0) targetpos.y = 0;
  else if (targetpos.y + self.objects.min.height > self.objects.el.height) targetpos.y = self.objects.el.height - self.objects.min.height;

  if (self.target_min) $('#'+self.objects.min.el).css({ left: targetpos.x + 'px', top: targetpos.y + 'px' });
  $(self.target).css('background-position', (targetpos.x * -1) + 'px ' + (targetpos.y * -1) + 'px' );

}
