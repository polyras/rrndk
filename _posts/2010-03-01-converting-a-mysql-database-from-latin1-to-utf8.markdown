---
layout: post
title: "Converting a mysql database from latin1 to utf8"
date: 2010-03-01 12:28:00
---
This week I successfully converted [Virtual Managers](http://www.virtualmanager.com/) mysql database from latin1 (aka. iso-8859-1) to UTF8. Since I guess I'm not the last person to do this, I'll here share how I did it.

The task can be divided into three steps:

* Dumping database
* Converting the dump
* Importing the dump into new database

Dumping the database
-------------------

By default [mysqldump](http://dev.mysql.com/doc/refman/5.1/en/mysqldump.html) dumps data in utf8 no matter what encoding your data is stored in. The reason this works seamlessly, is that it adds `SET NAMES 'utf8'` at the top of the dump file. This enables mysql to convert the data back to your database's encoding when importing it. This is the reason special characters might look weird if you're opening a dump file in an editor.

In order to convert our we need to dump our data as latin1. We do this with `--default-character-set`. Also, we do not want MySQL to add `SET NAMES 'utf8'`, so we use --skip-set-charset.

    mysqldump -uroot -p --default-character-set=latin1 --skip-set-charset DATABASE_NAME > dump.sql

Converting the dump
------------------

Converting the dump is easy. We use iconv for this:

    cat dump.sql | iconv -f ISO-8859-1 -t UTF-8 > dump_utf8.sql

dump_utf8.sql is now utf8-encoded. However, it stills contains a lot of "CREATE TABLE (...) DEFAULT CHARSET=latin1". We remove these like this:

    cat dump_utf8.sql | replace " DEFAULT CHARSET=latin1" "" > dump_utf8_formatted.sql

Should "replace" not be available to you, you can use [sed](http://en.wikipedia.org/wiki/Sed).

Importing the dump into new database
---------------------------------

Now, we must create a new database:

    mysql -uroot -p-e "CREATE DATABASE DATABASE_NAME_utf8 CHARACTER SET utf8 COLLATE utf8_unicode_ci"

We are now ready to perform the import. We use `--default-character-set` to tell MySQL that the incoming data is UTF8.

    mysql -uroot -p --default-character-set=utf8 DATABASE_NAME_utf8 < dump_utf8_formatted.sql

Voilà, your database is now utf8-encoded :)

Remember to make sure all database clients (most often web apps) now talk utf8 with the database.
