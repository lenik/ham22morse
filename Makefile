include coolmake/m2proj.mf

remotedir=/tmp/abc/
bin_files=.
src_excludes=*.scss Makefile server

all: .gitignore

dist:
	#scp app/build/outputs/apk/* a10:public/html/apk/
	cp app/*.apk a10:public/html/apk/
	scp app/*.apk $$HOME/public/html/apk/

work:
	@lsof-n ~/work/eclipse/job/.metadata/.lock | wc \
	    | (read n w c; if [ $$n == 0 ]; then eclipse & \
		else echo eclipse already started; fi )
	@ps fax | grep pgadmin3 | wc \
	    | (read n w c; if [ $$n -lt 4 ]; then pgadmin3 & \
		else echo pgadmin3 already started; fi )
	@ps fax | grep atom | wc \
	    | (read n w c; if [ $$n -lt 4 ]; then atom . & \
		else echo atom already started; fi )
	@echo "Don't forget to start scss auto builder."

.gitignore: .gitignore.in
	rm -f $@
	sed -e 's/ *#.*$$//' <$< >$@
	chmod -w $@

ChangeLog:
	gitcl | gitcl2 -t uni -r -m 20 -n 2 >ChangeLog

