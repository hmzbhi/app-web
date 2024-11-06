#!/bin/bash

NBERR_JS=$(grep -e "  error" backend/js_report.txt | wc -l)
NBWARN_JS=$(grep -e "  warning" backend/js_report.txt | wc -l)
color_js="green"

if [[ $NBERR_JS > 0 ]]; then
    color_js="red"
else
    if [[ $NBWARN_JS > 0 ]]; then
        color_js="orange"
    fi
fi

NBERR_JSX=$(grep -e "  error" frontend/jsx_report.txt | wc -l)
NBWARN_JSX=$(grep -e "  warning" frontend/jsx_report.txt | wc -l)
color_jsx="green"

if [[ $NBERR_JSX > 0 ]]; then
    color_jsx="red"
else
    if [[ $NBWARN_JSX > 0 ]]; then
        color_jsx="orange"
    fi
fi

curl -o badge_lint_js.svg "https://img.shields.io/badge/lint--js-$NBERR_JS%20errors,%20$NBWARN_JS%20warnings-$color_js"
curl -o badge_lint_jsx.svg "https://img.shields.io/badge/lint--jsx-$NBERR_JSX%20errors,%20$NBWARN_JSX%20warnings-$color_jsx"

if grep -q "All specs passed" frontend/cypress_report.txt; then 
    res="PASSED"
    color="green"
else 
    res="FAILED"
    color="red"
fi

curl -o badge_test.svg "https://img.shields.io/badge/jobcypress-$res-$color"