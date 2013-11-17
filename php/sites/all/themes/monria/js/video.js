$(function () {

    var Browser = {browser: null, version: null};
    Browser.isIE = function (ver) {
        if (Browser.browser == 'Explorer' && Browser.version == ver)
            return true;
    };

    Browser.browser = BrowserDetect.browser;
    Browser.version = BrowserDetect.version;

// Video header
    if (!Browser.isIE(6) && !Browser.isIE(7) && !Browser.isIE(8)) {
        var videoHeader = BgVideo.build("#flashObj", {
            sources: {

                'default': {

                    'mp4': 'videos/monria.mp4'
                }
            }
        });
    }

});


/**
 * BgVideo
 * @type {Object}
 */
var BgVideo = {
    element: null, // video tag
    playFormat: null, // supported browser format
    currentSource: null,
    config: {},
    sources: {},
    /**
     * Builds and returns an instance of the BgVideo class
     * @param element
     * @param config
     * @return instance of BgVideo class
     */
    build: function (element, config) {
        var instance = Object.create(BgVideo);
        instance.init(element, config);
        return instance;
    },
    /**
     * Initializes the instance of the BgVideo class
     * @param element
     * @param config
     */
    init: function (element, config) {

        this.element = $(element);
        this.video = this.element[0];
        this.config = config;
        this.sources = this.config.sources;
// Can Play webm

        if (this.canPlay("video/mp4")) {
            this.playFormat = "mp4";
        }
// bind events to make ui functional
        this.initEvents();
    },
    /**
     * Initializes any necessary browser events
     */
    initEvents: function () {
        var _this = this;
        this.checkSource();
// check source on resize
        $(window).on("resize", function () {
            _this.checkSource();
        });
// when the element can play, play it
        this.element.on("canplay", function () {
            this.play();
            $(this).animate({"opacity": 1}, 1000);
        });
    },
    /**
     * Checks the browser and makes sure the appropriate sources is set, playing if one is found
     */
    checkSource: function () {
        var width, source = null;
// If browser supports matchMedia
        if (window.matchMedia) {

            source = this.sources['default'][this.playFormat];

// specific catch for IE9 which supports HTML5 video, but not matchMedia
        } else {
            width = $(window).width();

            source = this.sources['default'][this.playFormat];

        }
        if (source && source != this.currentSource) {
            this.currentSource = source;
            this.playSource(source);
        }
    },
    /**
     * Wrapper function that checks if the browser can play the supplied video type
     * @param type
     * @param codecs
     * @return {Boolean}
     */
    canPlay: function (type, codecs) {
// Add codecs if supplied
        type = (codecs) ? type + ';codecs="' + codecs + '"' : type;
        var result = this.video.canPlayType(type);
        return !!(result == "maybe" || result == "probably");
    },
    /**
     * Attempts to play the specificied source
     * @param source
     */
    playSource: function (source) {
// Hide the video element
        $(this).css({"opacity": 0});
// Set the source and load
        this.element.attr("src", source);
        this.element.load();

    }
};

