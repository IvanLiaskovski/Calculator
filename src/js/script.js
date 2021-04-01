$(document).ready(function () {
    //Variables to create example and show example or symbol
    let example = "";
    let visExample = "";

    //Calculator screen
    let count = $(".big-count");
    let subCount = $(".small-count");

    //Variable to check if we click on "=" (get result)
    let rCheck = false;

    $(".btn-group button").on("click", function () {
        resultCheck($(this).val());
        refresh();
        //Separate numbers and math symbol
        separating(count, $(this).val(), $(this).text());

        //Double symbol(+, -, *...) check
        if (!checkSymbol(example, $(this).val(), $(this).text())) {
            return false;
        }
        //Add number or math symbol
        if ($(this).val() != "=" && $(this).val() != "clear") {
            if (!zeroFix()) return false;
            example += $(this).val();
            visExample += $(this).text();
            subCount.text(visExample);
        }
        //Clear screen
        else if ($(this).val() == "clear") {
            clear();
            return false;
        }
        //Solve an example
        else if ($(this).val() == "=") {
            fixExample();
            result();
            limit();
            if (!zeroDivide()) return false;
        }
        wrongStart();
        standartFont();
        limit();
    });

    //Function to separate numbers and (+, -, *, /)

    function separating(el, val, char) {
        if (val == "+" || val == "-" || val == "*" || val == "/") {
            el.text(char);
        }
        else {
            el.text((el.text() + val).replace(/[^0-9\.,]/g, ""));
        }
    }

    //Function to make imposible double plus, minus...

    function checkSymbol(el, symbol, char) {
        if (el.endsWith("/") || el.endsWith("*") || el.endsWith("+") || el.endsWith("-")) {
            if (symbol == "*" || symbol == "/" || symbol == "+" || symbol == "-") {
                example = example.replace(/.$/, symbol);
                visExample = visExample.replace(/.$/, char);
                subCount.text(visExample);
                return false;
            } else return true;
        } else return true;
    }

    //When the example is finished refresh visExample

    function refresh() {
        if (visExample.indexOf("=") != -1) {
            visExample = +visExample.substr(visExample.indexOf("=") + 1);
            visExample = (visExample.toFixed(0) == visExample.toFixed(2)) ?
                visExample.toFixed(0) : visExample;
            count.text("");
            subCount.text("");
        }
    }

    //Check if number length is wrong and change font-size or clear calculator

    function limit() {
        if (count.text().length > 9) {
            count.css({ "font-size": "1.2rem" });
            if (count.text().length > 14) {
                count.css({ "font-size": "1rem" });
                if (count.text().length > 18) {
                    clear("Digit limit met");
                    standartFont();
                }
            }
        }
        if (subCount.text().length > 24) {
            subCount.css({ "font-size": ".65rem" });
            if (subCount.text().length > 30) {
                clear("Digit limit met");
                standartFont();
            }
        }
    }

    //This function is use to back standart font-size

    function standartFont() {
        if (count.text().length < 9) {
            count.css({ "font-size": "1.9rem" });
        }
        if (count.text().length < 24) {
            subCount.css({ "font-size": ".75rem" });
        }
    }

    //Fix start width math symbol, 0 or .

    function wrongStart() {
        if (subCount.text().startsWith("×") || subCount.text().startsWith("+") ||
            subCount.text().startsWith("-") || subCount.text().startsWith("÷") ||
            subCount.text().startsWith("=")) {
            subCount.text(subCount.text().slice(1));
        }
        if (visExample.startsWith(".")) {
            visExample = visExample.split("");
            visExample.unshift("0");
            visExample = visExample.join("");
            subCount.text(visExample);
        }
        if (count.text().startsWith("0") && count.text().indexOf(".") == -1 &&
            count.text().length > 1) {
            count.text(count.text().slice(1));
        }

    }

    //This function is made imposible double zero without (.)

    function zeroFix() {
        if (count.text().startsWith("0") && count.text().indexOf(".") == -1
            && count.text().length > 1) {
            count.text(count.text().slice(1));
            if (count.text().length == 1 && count.text() != "0") {
                example += count.text();
                visExample += count.text();
                subCount.text(visExample);
            }
            return false;
        }
        return true;
    }

    //Fix error when example ends or starts with math symbol when we click "="

    function fixExample() {
        if (example.endsWith("-") || example.endsWith("+") || example.endsWith("*") ||
            example.endsWith("/")) {
            example = example.slice(0, example.length - 1);
            visExample = visExample.slice(0, visExample.length - 1)
        }
        if (example.startsWith("+") || example.startsWith("*")
            || example.startsWith("-") || example.startsWith("/")) {
            example = example.slice(1);
        }
    }

    /*When we get result and click a number we create a new example, if we 
    click on not a number we continue current example
    */
    function resultCheck(char) {
        if (rCheck && char != "clear" && char != "/" && char != "*" &&
            char != "-" && char != "+") {
            clear();
            rCheck = false;
        }
        else {
            rCheck = false;
        }
    }

    function result() {
        let result = eval(example);
        result = (result == result.toFixed(2)) ? result : result.toFixed(2);
        example = String(result);
        visExample = visExample + "=" + String(result);
        count.text(result);
        rCheck = true;
        subCount.text(visExample);
    }

    function clear(text = "0") {
        example = "";
        visExample = "";
        count.text("0");
        subCount.text(text);
    }

    //Fix Js zero divide

    function zeroDivide() {
        if (count.text() == "Infinity" || isNaN(count.text()) ||
            subCount.text().endsWith("Infinity")) {
            clear("Error divide to zero");
            return false;
        }
        return true;
    }
});
