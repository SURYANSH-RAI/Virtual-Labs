/*
 *  Trip.js - A jQuery plugin that can help you customize your tutorial trip easily
 *  Version : 1.0.1
 *
 *  Author : EragonJ <eragonj@eragonj.me>
 *  Blog : http://eragonj.me
 * 
 */ 

var tripActive = false;
(function (e, t) {
    function r(t, n) {
        var r,
            i,
            s = n;
        (this.pause = function () {
            e.clearTimeout(r), (s -= new Date() - i);
        }),
            (this.resume = function () {
                return (i = new Date()), (r = e.setTimeout(t, s)), s;
            }),
            (this.stop = function () {
                e.clearTimeout(r);
            }),
            this.resume();
    }
    var n = function (n, r) {
        (this.settings = t.extend({ tripIndex: 0, backToTopWhenEnded: !1, overlayZindex: 99999, delay: 1e3, enableKeyBinding: !0, onTripStart: t.noop, onTripEnd: t.noop, onTripStop: t.noop }, r)),
            (this.tripData = n),
            (this.$tripBlock = null),
            (this.$tripArrow = null),
            (this.$overlay = null),
            (this.$bar = null),
            (this.$root = t("body, html")),
            (this.tripIndex = this.settings.tripIndex),
            (this.timer = null),
            (this.progressing = !1),
            (this.hasExpose = !1),
            (this.CONSTANTS = { LEFT_ARROW: 37, UP_ARROW: 38, RIGHT_ARROW: 39, DOWN_ARROW: 40, ESC: 27, SPACE: 32 }),
            (this.console = e.console || {});
    };
    (n.prototype = {
        preInit: function () {
            if (typeof this.console == "undefined") {
                var e = this,
                    n = ["log", "warn", "debug", "info", "error"];
                t.each(n, function (n, r) {
                    e.console[r] = t.noop;
                });
            }
        },
        showExpose: function (e) {
            this.hasExpose = !0;
            var t, n;
            (t = { position: e.css("position"), zIndex: e.css("z-Index") }), (n = { position: "relative", zIndex: this.settings.overlayZindex + 1 }), e.data("trip-old-css", t).css(n).addClass("trip-exposed"), this.$overlay.show();
        },
        hideExpose: function () {
            this.hasExpose = !1;
            var e = t(".trip-exposed"),
                n = e.data("trip-old-css");
            e.css(n).removeClass("trip-exposed"), this.$overlay.hide();
        },
        bindKeyEvents: function () {
            var e = this;
            t(document).on({
                "keydown.Trip": function (t) {
                    e.keyEvent.call(e, t);
                },
            });
        },
        unbindKeyEvents: function () {
            t(document).off("keydown.Trip");
        },
        keyEvent: function (e) {
            switch (e.which) {
                case this.CONSTANTS.ESC:
                    this.stop();
                    break;
                case this.CONSTANTS.SPACE:
                    e.preventDefault(), this.pause();
                    break;
                case this.CONSTANTS.LEFT_ARROW:
                case this.CONSTANTS.UP_ARROW:
                    this.prev();
                    break;
                case this.CONSTANTS.RIGHT_ARROW:
                case this.CONSTANTS.DOWN_ARROW:
                    this.next();
            }
        },
        stop: function () {
            tripFlag = false;
            this.timer.stop(), this.hasExpose && this.hideExpose(), (this.tripIndex = this.settings.tripIndex), this.hideTripBlock(), this.settings.onTripStop();
        },
        pause: function () {
            if (this.progressing) this.timer.pause(), this.pauseProgressBar();
            else {
                var e = this.timer.resume();
                this.resumeProgressBar(e);
            }
            this.progressing = !this.progressing;
        },
        next: function () {
            this.isLast() ? this.doLastOperation() : (this.increaseIndex(), this.run());
        },
        prev: function () {
            this.isFirst() || (this.decreaseIndex(), this.run());
        },
        showCurrentTrip: function (e) {
            this.timer && this.timer.stop(),
                this.hasExpose && this.hideExpose(),
                this.progressing && (this.hideProgressBar(), (this.progressing = !1)),
                this.checkTripData(e),
                this.setTripBlock(e),
                this.showTripBlock(e),
                e.expose && this.showExpose(e.sel);
        },
        doLastOperation: function () {
            return (
                this.timer.stop(),
                this.settings.enableKeyBinding && this.unbindKeyEvents(),
                this.hideTripBlock(),
                this.hasExpose && this.hideExpose(),
                this.settings.backToTopWhenEnded && this.$root.animate({ scrollTop: 0 }, "slow"),
                (this.tripIndex = this.settings.tripIndex),
                this.settings.onTripEnd(),
                !1
            );
        },
        showProgressBar: function (e) {
            var t = this;
            this.$bar.animate({ width: "100%" }, e, "linear", function () {
                t.$bar.width(0);
            });
        },
        hideProgressBar: function () {
            this.$bar.width(0), this.$bar.stop(!0);
        },
        pauseProgressBar: function () {
            this.$bar.stop(!0);
        },
        resumeProgressBar: function (e) {
            this.showProgressBar(e);
        },
        run: function () {
            var e = this,
                t = this.getCurrentTripObject(),
                n = t.delay || this.settings.delay;
            this.showCurrentTrip(t),
                this.showProgressBar(n),
                (this.progressing = !0),
                (this.timer = new r(function () {
                    e.hasCallback() && t.callback(e.tripIndex), e.next();
                }, n));
        },
        isFirst: function () {
            return this.tripIndex === 0 ? !0 : !1;
        },
        isLast: function () {
            return this.tripIndex === this.tripData.length - 1 ? !0 : !1;
        },
        hasCallback: function () {
            return typeof this.tripData[this.tripIndex].callback != "undefined";
        },
        increaseIndex: function () {
            this.tripIndex >= this.tripData.length - 1 || (this.tripIndex += 1);
        },
        decreaseIndex: function () {
            this.tripIndex <= 0 || (this.tripIndex -= 1);
        },
        getCurrentTripObject: function () {
            return this.tripData[this.tripIndex];
        },
        checkTripData: function (e) {
            if (typeof e.sel == "undefined" || typeof e.content == "undefined") 
                return this.console.warn("Your tripData is not valid in obj :" + e + "."), !1;
        },
        setTripBlock: function (e) {tripFlag
            tripActive = true;
            this.$tripBlock.find(".trip-content").html(e.content);
            var t = e.sel,
                n = t.outerWidth(),
                r = t.outerHeight(),
                i = this.$tripBlock.outerWidth(),
                s = this.$tripBlock.outerHeight(),
                o = 10,
                u = 10;
            this.$tripArrow.removeClass("e s w n");
            switch (e.position) {
                case "e":
                    this.$tripArrow.addClass("e"), this.$tripBlock.css({ left: (t.offset().left + n + u), top: (t.offset().top - (s - r) / 2)});
                    break;
                case "s":
                    this.$tripArrow.addClass("s"), this.$tripBlock.css({ left: (t.offset().left + (n - i) / 2), top: (t.offset().top + r + o)});
                    break;
                case "w":
                    this.$tripArrow.addClass("w"), this.$tripBlock.css({ left: (t.offset().left - (u + i)), top: (t.offset().top - (s - r) / 2)});
                    break;
                case "n":
                default:
                    this.$tripArrow.addClass("n"), this.$tripBlock.css({ left: (t.offset().left + (n - i) / 2), top: (t.offset().top - o - s)});
            }
            
            
            
        },
        showTripBlock: function (e) {
            this.$tripBlock.css({ display: "inline-block", zIndex: this.settings.overlayZindex + 1 });
            var t = this.$tripBlock.offset().top,
                n = 100;
            this.$root.animate({ scrollTop: t - n }, "slow");
        },
        hideTripBlock: function () {
            tripActive = false;
            this.$tripBlock.fadeOut("slow");
            tripFlag = false;
        },
        create: function () {
            this.$tripBlock || (this.createTripBlock(), this.createOverlay());
        },
        createTripBlock: function () {
            if (typeof t(".trip-block").get(0) == "undefined") {
                var e = ['<div class="trip-block">', '<div class="trip-content"></div>', '<div class="trip-progress-wrapper">', '<div class="trip-progress-bar"></div>', "</div>", '<div class="trip-arrow"></div>', "</div>"].join(""),
                    n = t(e);
                t("body").append(n);
            }
        },
        createOverlay: function () {
            if (typeof t(".trip-overlay").get(0) == "undefined") {
                var e = ['<div class="trip-overlay">', "</div>"].join(""),
                    n = t(e);
                n.height(t(document).height()), t("body").append(n);
            }
        },
        init: function () {
            this.preInit(), this.settings.enableKeyBinding && this.bindKeyEvents(), (this.$bar = t(".trip-progress-bar")), (this.$overlay = t(".trip-overlay")), (this.$tripArrow = t(".trip-arrow")), (this.$tripBlock = t(".trip-block"));
        },
        start: function () {
            tripFlag = true;
            this.settings.onTripStart(), this.create(), this.init(), this.run();
        },
    }),
        (e.Trip = n);
})(window, jQuery);
