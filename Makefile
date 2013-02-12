# CSS Directory
CSS_DIR = public/css/
 
# LESS Directory
LESS_DIR = public/less/
 
# JS Directory
JS_DIR = public/js/
COFFEE_DIR = public/coffee/
 
# minify CSS with LESSC
css:
	lessc ${LESS_DIR}style.less ${CSS_DIR}main.css -compress
 
# compile JavaScript
js: 
	coffee --compile -o public/js public/coffee
 
# start node
run: 
	make js 
	make css 
	coffee index.coffee &
 
restart:
	ps aux | ack "[c]offee index.coffee" | tr -s " " | cut -d ' ' -f 2 | xargs kill
	make run
 
.PHONY: js css
