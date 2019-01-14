'use strict'

module.exports = class sqlGenerator {
  constructor() {
    this.code = '';
    this.array = '';
  }

  generate(data) {
      if(data.length > 0) {


        for (let i = 0; i < data.length; i++) {
            let entity = data[i];

            this.code += ('DROP TABLE IF EXISTS '+ entity.name +';\n');

            this.code += ('CREATE TABLE ' + entity.name + '( \n');

            if(entity.attr.length > 0) {
              let pk = false;
              for(let i = 0; i < entity.attr.length; i++) {
                  let attribute = entity.attr[i];
                  if(attribute.array === 'true')
                    attribute.type= 'Array';
                  this.newField(
                      attribute.name,
                      attribute.type,
                      attribute.primaryKey,
                  );
                  if(attribute.primaryKey === 'true')
                    pk = true;
                  if( i === entity.attr.length-1)
                    this.code +=('\n');
                    else {
                      this.code +=(',\n');
                    }
              }
              if(!pk)
                this.code += ('id INT AUTO_INCREMENT PRIMARY KEY \n');
            }
            else {
              this.code += ('id INT AUTO_INCREMENT PRIMARY KEY \n');
            }
            this.code += (');\n\n');
        }

        let aux = this.code;
        this.code = '';

        return aux;
      }
      else {
          return '';
      }
  }

  newField(name, type,  primaryKey) {
      this.code += (name + ' ');
      if(type === 'String')
      this.code += ('VARCHAR(30) ');
      if(type === 'Integer')
      this.code += ('INT(6) ');
      if(type === 'Double')
      this.code += ('FLOAT(16) ');
      if(type === 'Data')
      this.code += ('DATE ');
      if(type === 'Boolean')
      this.code += ('BOOLEAN ');
      if(type === 'Array')
      this.code += ('TEXT ');
      if(primaryKey === 'true'){
          this.code += (' PRIMARY KEY');
      }
}


}
