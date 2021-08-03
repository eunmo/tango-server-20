CREATE USER 'dummy_user'@'%' IDENTIFIED WITH mysql_native_password BY 'dummy_password';
CREATE DATABASE tango;
GRANT ALL PRIVILEGES ON tango.* TO 'dummy_user'@'%';
CREATE DATABASE tangotest;
GRANT ALL PRIVILEGES ON tangotest.* TO 'dummy_user'@'%';
