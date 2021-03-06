// JQuery extension function to detect if a given node is
// currently viewed in the viewport.
$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

// Document Initialization.
$(document).ready(function() {

    // *** Initialization ***
    $(".button-collapse").sideNav();
    $(".modal").modal();
    // Theme initialization with default
    themifyMe("bw");

    // Sticky nav-bar logic as offered by google.
    // ISSUE: It jumps! Not so fine crafted as expected :(
    // var getNavbarOffset = function(){
    //   return $(".nav-sticky").offset().top;
    // }
    // var navbarInitialOffset = getNavbarOffset();
    // $('.nav-sticky').pushpin({
    //   top: navbarInitialOffset,
    //   bottom: Infinity,
    //   offset: 0
    // });

    // *** Sticky Navbar Logic ***
    var getNavbarOffset = function() {
        var jqNavbar = $(".nav-sticky");
        if (jqNavbar.css("position") == "static") {
            return $(".nav-sticky").offset().top;
        } else {
            return navbarInitialOffset;
        }
    };
    var navbarInitialOffset = getNavbarOffset();
    var navbarHeight = $(".nav-sticky").height();
    var checkStickyNav = function() {
        var currentScrollTop = $(window).scrollTop();
        if (currentScrollTop > navbarInitialOffset) {
            // Take navbar out from layout to fixed position
            $(".nav-sticky").css({
                'position': 'fixed',
                "top": 0,
                "width": "100%"
            });
            $("main").css("padding-top", navbarHeight);
        } else {
            // Put back navbar into DOM layout
            $(".nav-sticky").css("position", "static");
            $("main").css("padding-top", 0);
        }
    };

    // *** Themify Tool Logic ***
    var themifyToolOnlyOnMain = false;
    if (themifyToolOnlyOnMain) {
        $(".themify-tool").hide();
    }

    // *** Themify tool checker function ***
    var checkThemifyTool = function() {
        if (themifyToolOnlyOnMain) {
            var currentScrollTop = $(window).scrollTop();
            if ( /*(currentScrollTop > (navbarInitialOffset / 3)) &&*/ !$("footer").isInViewport()) {
                $(".themify-tool").show("slow");
            } else {
                $(".themify-tool").hide("slow");
            }
        }

    };

    // Bind checkers to Scroll and Resize
    $(window).scroll(function() {
        checkStickyNav();
        checkThemifyTool();
    });
    $(window).resize(function() {
        navbarInitialOffset = getNavbarOffset();
        checkStickyNav();
        checkThemifyTool();

        // Lets wait a timeout for the resize to completely finish.
        // This will make resizing feels lighter preventing heavy
        // tasks to be done continuously while resizing.
        clearTimeout(window.resizedFinished);
        window.resizedFinished = setTimeout(function() {
            themifyHeaderJumbo();
        }, 300);
    });
});

// Themify tool apply function.
var themifyMe = function(themeName) {

    // STEP 1: Find and replace all occurences of class "theme-<x>" where
    // x is the name of the theme.
    $(document).find("[class*='theme-']").attr("class", function(i, cls) {
        return cls.replace(/theme-(.*)/, "theme-" + themeName);
    });

    // STEP 2: Update header jumbo 'canvas'.
    themifyHeaderJumbo();
};
// Helper method to update header jumbo background in canvas mode.
var themifyHeaderJumbo = function() {
    // We are going to regenerate header jumbo canvas dinamically
    // using the wonderful Trianglify JS library.
    var secondaryColor = $(".header-jumbo").css("background-color");
    var primaryColor = $(".header-jumbo").css("color");
    var hjHeight = $(".header-jumbo").height();
    var hjWidth = $(".header-jumbo").width();

    var pattern = Trianglify({
        height: hjHeight,
        width: hjWidth,
        cell_size: Math.random() * 150 + 40,

        x_colors: ["#FFFFFF", primaryColor, "#000000"],
        y_colors: ["#FFFFFF", secondaryColor, "#000000"],

        // x_colors: ["#FFFFFF", "#FFFFFF", secondaryColor, "#000000"],
        // y_colors: [primaryColor, secondaryColor, "#000000"],
    });
    var patternUrl = "url('" + pattern.png() + "')";
    $(".header-jumbo__canvas").css("background-image", patternUrl);
};
