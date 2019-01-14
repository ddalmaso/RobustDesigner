/*
* File: xmlGenerator.js
* Version: 1.0
* Type: javascript
* Date: 2018-08-16
* Author: Leo Moz
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/

'use strict';

module.exports = class XMLGenerator {

    constructor() {
        this.code = '';
    }

    generateConfig(data) {

        this.code += ('<?xml version = "1.0" encoding = "UTF-8"?>\n');
        //this.code += ('<!DOCTYPE hibernate-configuration SYSTEM "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">\n\n');
        this.code += ('<!DOCTYPE hibernate-configuration PUBLIC "-//Hibernate/Hibernate Configuration DTD 5.3//EN" "http://hibernate.sourceforge.net/hibernate-configuration-5.3.dtd"> \n \n');
        this.code += ('<hibernate-configuration>\n');
        this.code += ('   <session-factory>\n\n');

		this.code += ('      <property name="hbm2ddl.auto">\n');
		this.code += ('          update');
		this.code += ('      </property>\n\n');
        this.code += ('      <property name="dialect">\n');
        this.code += ('          org.hibernate.dialect.MySQLDialect\n');
        this.code += ('      </property>\n\n');

        this.code += ('      <property name="connection.driver_class">\n');
        this.code += ('          com.mysql.jdbc.Driver\n');
        this.code += ('      </property>\n\n');

        this.code += ('      <property name="connection.url">\n');
        this.code += ('          jdbc:mysql://localhost:80/ironworks\n');
        this.code += ('      </property>\n\n');

        this.code += ('      <property name="connection.username">\n');
        this.code += ('          root\n');
        this.code += ('      </property>\n\n');

        this.code += ('      <property name="connection.password">\n');
        this.code += ('          ironworks\n');
        this.code += ('      </property>\n\n');

        this.code += ('      <mapping resource="diagram.hbm.xml"/>\n\n')

        this.code += ('   </session-factory>\n');
        this.code += ('</hibernate-configuration>\n');


        let aux = this.code;
        this.code = '';
        return aux;

    }

    generateCode(data) {

        this.code += ('<?xml version = "1.0" encoding = "UTF-8"?>\n');
        this.code += ('<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 5.3//EN" "http://hibernate.sourceforge.net/hibernate-mapping-5.3.dtd">\n\n');

        this.code += ('<hibernate-mapping>\n \n');
          for (let i = 0; i < data.length; i++) {
              let entity = data[i];
              this.code += ('<class name="com.jurassicswe.ironworks.diagram.');
			  this.code += entity.name;
			  this.code += ('" table="');
              this.code += entity.name;
              this.code += ('">\n');
              let Prim=false;
              let attrs=entity.attr;
              if(attrs.length > 0) {
                for(let i = 0; i < attrs.length; i++) {
                  let attribute=attrs[i];
                  if(attribute.primaryKey=='true'){
                    Prim=true;
                    this.code += ('\t<id name="');
                    this.code += attribute.name;
                    this.code += ('"></id>\n');
                  }else{
                    this.code += ('\t<property name="');
                    this.code += attribute.name;
                    this.code += ('"></property>\n');
                  }
                }
                if(!Prim){
                  this.code += ('\t<id name="id">\n\t\t<generator class="assigned"></generator>\n\t</id>\n');
                }
              }
              this.code += ('</class>\n\n');
          }
          this.code += ('</hibernate-mapping>');
          let aux = this.code;
          this.code = '';
          return aux;
    }

}