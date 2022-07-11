import cash from "cash-dom";
import feather from "feather-icons";
(function (cash) {
    const setup = () => {
        cash(".dark-mode-switcher").on("click", function () {
            if (cash("html").hasClass("dark")) {
                cash("html").removeClass("dark").addClass("light");
            } else {
                cash("html").removeClass("light").addClass("dark");
            }
        });

        feather.replace();
    }
    cash.fn.app = function () {
        setup();
    };
})(cash);