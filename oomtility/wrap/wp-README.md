# Setting Up WordPress

The ${{title}} frontend may optionally be connected to a WordPress backend.


#### Setting up an AMP stack for the first time on macOS 10.13 High Sierra (from [Neil Gee’s article](https://coolestguidesontheplanet.com/install-apache-mysql-php-and-phpmyadmin-on-macos-high-sierra-10-13/))

1. Apache should already be installed:  
  `$ httpd -v` should output `Server version: Apache/2.4.28 (Unix)` or similar.
2. Create your user’s ‘Sites’ folder (macOS no longer creates by default):  
  `$ mkdir ~/Sites; chmod 755 ~/Sites`
3. Check that your user does not currently have an Apache config file:  
  ``$ cat /etc/apache2/users/`whoami`.conf``
4. Create your user’s Apache config file:
  ```
  $ sudo bash -c 'echo -e \
  "<Directory \"/Users/'`whoami`'/Sites/\">"\
  "\n  AllowOverride All"\
  "\n  Options Indexes MultiViews FollowSymLinks"\
  "\n  Require all granted"\
  "\n</Directory>\n" > /etc/apache2/users/'`whoami`'.conf';\
  sudo chmod 644 /etc/apache2/users/`whoami`.conf
  ```
5. `$ sudo nano /etc/apache2/httpd.conf` and uncomment these lines:  
  `LoadModule authz_core_module libexec/apache2/mod_authz_core.so` (already unc.)  
  `LoadModule authz_host_module libexec/apache2/mod_authz_host.so` (already unc.)  
  `LoadModule userdir_module libexec/apache2/mod_userdir.so`  
  `LoadModule include_module libexec/apache2/mod_include.so`  
  `LoadModule rewrite_module libexec/apache2/mod_rewrite.so`  
  `LoadModule php7_module libexec/apache2/libphp7.so`  
  `Include /private/etc/apache2/extra/httpd-userdir.conf` (allows for home dirs)
6. `$ sudo nano /etc/apache2/extra/httpd-userdir.conf` and uncomment this line:  
  `Include /private/etc/apache2/users/*.conf`
7. After `$ sudo apachectl start` (perhaps after rebooting your computer):  
  `$ echo '<?php phpinfo(); ?>' > ~/Sites/index.php`  
  ``$ open http://localhost/~`whoami` `` should show the PHP info page
8. Install mysql-5.7.21-1-macos10.13-x86_64.dmg (339MB) from [here](https://dev.mysql.com/downloads/mysql/).  
  The .tar.gz would not be simple to set up. Click ‘No thanks, just start my download.’
9. Add MySQL to your PATH:  
  `$ echo -e '\nexport PATH="/usr/local/mysql/bin:$PATH"' >> ~/.bash_profile`  
  `$ source ~/.bash_profile` (make it immediately available)
10. Change the unique password for the MySQL ‘root’ user:  
  `$ sudo /usr/local/mysql/support-files/mysql.server stop` to stop mysql if running  
  `$ sudo mysqld_safe --skip-grant-tables` to start MySQL in safe mode  
  `cmd-z` and `$ bg` to send the running process to your Bash session’s background  
  `$ mysql -u root` to begin the MySQL monitor  
  `mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';`  
  `mysql> \q` to quit — the new password is 'root'  
  `$ fg` and `ctrl-c` to quit safe-mode MySQL
11. In ‘System Preferences > MySQL’, deselect ‘Automatically start … Startup’  
12. Fix the 2002 MySQL Socket error:  
  `$ sudo mkdir /var/mysql; sudo ln -s /tmp/mysql.sock /var/mysql/mysql.sock`
13. Download phpMyAdmin-4.7.9-english.tar.gz (5.7MB) from [here](https://www.phpmyadmin.net/downloads/), and then:  
  `$ tar xzf ~/Downloads/phpMyAdmin-4.7.9-english.tar.gz -C ~/Sites`  
  `$ ln -s ~/Sites/phpMyAdmin-4.7.9-english ~/Sites/phpmyadmin`  
  `$ mkdir ~/Sites/phpmyadmin/config; chmod o+w ~/Sites/phpmyadmin/config`  
  ``$ open http://localhost/~`whoami`/phpmyadmin/setup/``  
  Click ‘new server’, the ‘Authentication’ tab.  
  Enter 'root' next to ‘Password for config auth’.  


#### Setting up WordPress for the first time

1. Download the WordPress .tar.gz (8.2MB) from [here](https://wordpress.org/download/), and then:  
  `$ tar xzf ~/Downloads/wordpress-4.9.4.tar.gz -C ~/Sites`  
  `$ ln -s ~/Sites/wordpress ~/Sites/wp`  
2. Download, install and activate the CMB2 plugin:  
  `$ open https://downloads.wordpress.org/plugin/cmb2.zip`  
  `$ tar xzf ~/Downloads/cmb2.zip -C ~/Sites/wp/wp-content/plugins`  
  ``$ open http://localhost/~`whoami`/wp/wp-admin/plugins.php``  
  Click ‘Activate’ under ‘CMB2’.  
  The ‘active_plugins’ field in the database’s ‘wp_options’ table will be updated.
3. Download, install and activate the Basic Auth plugin:  
  `$ git clone --depth=1 --branch=master https://github.com/WP-API/Basic-Auth.git ~/Sites/wp/wp-content/plugins/Basic-Auth`  
  `$ rm -rf ~/Sites/wp/wp-content/plugins/Basic-Auth/.git`  
  ``$ open http://localhost/~`whoami`/wp/wp-admin/plugins.php``  
  Click ‘Activate’ under ‘JSON Basic Authentication’.  
  Note that Basic-Auth _is not secure_ and should only be used for dev, or over HTTPS.  
4. For servers in ‘CGI’ or ‘FastCGI’ modes (eg Dreamhost):  
  Install and activate the ‘Application Passwords’ plugin via the plugins page  
  Click ‘Activate’ under ‘Application Passwords’.  
  In .htaccess after `RewriteEngine On`, add:  
  `RewriteRule .* - [E=REMOTE_USER:%{HTTP:Authorization}]`

<!--
From http://www.efficiencyofmovement.com/set-postman-wordpress-wp-rest-api/
3. Download, install and activate the OAuth1 plugin:  
  `$ git clone --depth=1 --branch=master https://github.com/WP-API/OAuth1.git ~/Sites/wp/wp-content/plugins/OAuth1`  
  `$ rm -rf ~/Sites/wp/wp-content/plugins/OAuth1/.git`  
  ``$ open http://localhost/~`whoami`/wp/wp-admin/plugins.php``  
  Click ‘Activate’ under ‘OAuth2’.  
  Note that OAuth1 _does not_ require HTTPS, but OAuth2 _does_.  
4. Create a new OAuth1 Application and Consumer.
  ``$ open http://localhost/~`whoami`/wp/wp-admin/users.php?page=rest-oauth1-apps``  
  Click ‘Add New’, and enter:
    - ‘Postman’ for the ‘Consumer Name’  
    - ‘Testing WP API’ for the ‘Description’  
    - ‘oauth1-postman’ for the ‘Callback’  
  Make a note of the ‘Client Key’ and ‘Client Secret’.
5. Begin authorizing Postman:  
  Create a new ‘Request’, called ‘Oom Test’  
  ‘http://localhost/~<your-macos-user>/wp/oauth1/request’ in ‘Enter Request URL’
  Click the ‘Authorization’ tab  
  Under ‘Type’ select ‘OAuth 1.0’  
  Under ‘Add authorization data to’ select ‘Request Headers’  
  Paste the WordPress ‘Client Key’ into ‘Consumer Key’  
  Paste the WordPress ‘Client Secret’ into ‘Consumer Secret’  
  Click ‘Send’
  Make a note of the response, something like:  
  `oauth_token=y5JaJxbAOUGnjfmMB1u5ar2c&oauth_token_secret`  
  `=sFyOC8jeboPDInDSt9xrGHWSX1TJHF5vRYAUwFsKMYlPDhh8&oauth_callback_confirmed=true`  
6. Combine the ‘Client Key’, ‘oauth_token’ and ‘oauth_token_secret’ into a URL,
  and visit it in a browser you are logged into WordPress on:  
  `$ CK=xx`  replace xx with your ‘Client Key’  
  `$ OT=xx`  replace xx with your ‘oauth_token’  
  `$ OTS=xx`  replace xx with your ‘oauth_token_secret’  
  ``$ open http://localhost/~`whoami`'/wp/wp-login.php?action=oauth1_authorize&oauth_consumer_key='$CK'&oauth_token='$OT'&oauth_token_secret='$OTS``
7. Finish authorizing Postman:
  You should see a page titled ‘Connect Postman’  
  Click the ‘Authorize’ button  
  Make a note of the verification token, something like:  
  `RGCn6nBwWGvccef30siifLYw`  
-->


#### Setting up ${{title}} for WordPress

1. Start the MySQL server and create a database:  
  `$ sudo /usr/local/mysql/support-files/mysql.server start`  
  ``$ open http://localhost/~`whoami`/phpmyadmin/server_databases.php`` (password is 'root')  
  Enter '${{projectLCU}}' as the ‘Database name’.  
2. Link WordPress to the ${{projectLC}} repo:  
  `$ cd path/to/${{projectLC}}` (cd to the ${{projectLC}} repo directory)  
  `$ ln -s $PWD'/support/wp/wp-config.php' ~/Sites/wp`  
  `$ ln -s $PWD'/support/wp/plugin' ~/Sites/wp/wp-content/plugins/${{projectLC}}`  
3. Init the site:  
  ``$ open http://localhost/~`whoami`/wp`` should show the ‘Welcome’ page  
  Enter '${{projectLCU}}' as the ‘Database name’.  
  Enter 'root' as the ‘Username’ and ‘Password’, and check ‘Confirm use …’.  
  Click through to confirm, and log in to wp-admin.  
  Note: at this point, none of the files in ‘~/Sites/wp/’ have changed.  
  The ‘${{projectLCU}}’ database’s ‘wp_options’ table is populated with 128 rows.  
  Also, the ‘root’ user, default comment and posts, and the ‘Uncategorized’ category.  
4. Enable pretty permalinks:
  ``$ open http://localhost/~`whoami`/wp/wp-admin/options-permalink..php``  
  Check the ‘Post name’ radio button.  
  Click ‘Save Changes’.  
  Copy-paste the suggested ‘.htaccess’ content into ‘~/Sites/wp/.htaccess’.
5. Activate the ${{title}} plugin:  
  ``$ open http://localhost/~`whoami`/wp/wp-admin/plugins.php``  
  Click ‘Activate’ under ‘${{title}}’.  
  The ‘active_plugins’ field in the database’s ‘wp_options’ table will be updated.


#### Before each dev session

1. Start Apache and MySQL:  
  `$ sudo apachectl start; sudo /usr/local/mysql/support-files/mysql.server start`


#### After each dev session

1. Stop Apache and MySQL:  
  `$ sudo apachectl stop; sudo /usr/local/mysql/support-files/mysql.server stop`
