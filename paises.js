const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function migrarDatos() {
    try {
        // Conectar al servidor de MongoDB
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        for (let codigo = 1; codigo <= 300; codigo++) {
            const url = `https://restcountries.com/v2/callingcode/${codigo}`;
            const response = await fetch(url);
            const countryDataList = await response.json();

            if (countryDataList.length > 0) {
                for (let countryData of countryDataList) {
                    const nombrePais = countryData.name || null;
                    const capitalPais = countryData.capital || null;
                    const region = countryData.region || null;
                    const poblacion = countryData.population || null;
                    const latitud = countryData.latlng ? countryData.latlng[0] : null;
                    const longitud = countryData.latlng ? countryData.latlng[1] : null;
                    const codigoPais = countryData.callingCodes ? countryData.callingCodes[0] : null;

                    const existingCountry = await collection.findOne({ codigoPais });

                    if (existingCountry) {
                        await collection.updateOne(
                            { codigoPais },
                            {
                                $set: {
                                    nombrePais,
                                    capitalPais,
                                    region,
                                    poblacion,
                                    latitud,
                                    longitud
                                }
                            }
                        );
                    } else {
                        await collection.insertOne({
                            codigoPais,
                            nombrePais,
                            capitalPais,
                            region,
                            poblacion,
                            latitud,
                            longitud
                        });
                    }
                }
            }
        }

        console.log('Proceso de migración completado');
    } catch (error) {
        console.error('Error durante la migración de datos:', error);
    } finally {
        // Cerrar la conexión con el cliente MongoDB
        await client.close();
    }
}

//migrarDatos();


//Codifique un método que seleccione los documentos de la colección países donde la región sea
//Americas. Muestre el resultado por pantalla o consola.

async function regionAmericaDatos() {
    try {

            await client.connect();
            const db = client.db('paises_db');

            // Buscar los países con región "Americas"
            const countriesInAmericas = await db.collection('paises').find({ region: 'Americas' }).toArray();

            // Mostrar los resultados por consola
            console.log('Países en la región Americas:');
            console.log(countriesInAmericas);
        
           
        
    } catch (error) {
        console.error('Error al seleccionar países por región:', error);
    } finally {
        // Cerrar la conexión solo si estaba abierta

            await client.close();
        }
    }

//regionAmericaDatos();

//Codifique un método que seleccione los documentos de la colección países donde la región sea
//Americas y la población sea mayor a 100000000. Muestre el resultado por pantalla o consola.

async function regionAmericaMaxDatos(region, populationThreshold) {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        // Seleccionar la base de datos y la colección
        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta con la región y la población
        const query = { region: region, poblacion: { $gt: populationThreshold } };

        // Realizar la consulta y obtener los resultados
        const result = await collection.find(query).toArray();

        // Mostrar el resultado por consola
        console.log(`Países en la región ${region} con población mayor a ${populationThreshold}:`, result);
    } catch (error) {
        console.error('Error al buscar países por región y población:', error);
    } finally {
        // Cerrar la conexión con la base de datos
        await client.close();
    }
}

//regionAmericaMaxDatos('Americas', 10000000);

//Codifique un método que seleccione los documentos de la colección países donde la región sea
//distinto de Africa. (investigue $ne). Muestre el resultado por pantalla o consola.

async function datosSinAfrica() {
    try {
        
            await client.connect();
       

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta para seleccionar documentos donde la región no sea "Africa"
        const query = { region: { $ne: 'Africa' } };
        const result = await collection.find(query).toArray();

        console.log('Países cuya región no es Africa:');
        console.log(result);

        return result;
    } catch (error) {
        console.error('Error al seleccionar países por región:', error);
    }
}

//datosSinAfrica();

//Codifique un método que actualice el documento de la colección países donde el name sea Egypt,
//cambiando el name a “Egipto” y la población a 95000000
async function ActualizacionEgipto() {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta para seleccionar el documento a actualizar
        const filter = { nombrePais: 'Egypt' };

        // Definir las actualizaciones que deseas realizar
        const updateDoc = {
            $set: {
                nombrePais: 'Egipto',
                poblacion: 95000000
            }
        };

        // Ejecutar la actualización del documento
        const result = await collection.updateOne(filter, updateDoc);

        console.log('Resultado de la actualización:');
        console.log(result);

        // Buscar y mostrar el documento actualizado
        const updatedDocument = await collection.findOne({ nombrePais: 'Egipto' });
        console.log('Documento actualizado:');
        console.log(updatedDocument);

        return updatedDocument;
    } catch (error) {
        console.error('Error al actualizar el país y mostrar el cambio:', error);
    
    }
}

//ActualizacionEgipto();

//Codifique un método que elimine el documento de la colección países donde el código del país sea
//258

async function EliminarPais258(code) {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta para seleccionar el documento a eliminar
        const filter = { codigoPais: code };
        console.log(filter);
        // Ejecutar la eliminación del documento
        const result = await collection.deleteOne(filter);

        console.log('Resultado de la eliminación:');
        console.log(result);

        return result;
    } catch (error) {
        console.error('Error al eliminar el país:', error);
    } 
}

//EliminarPais258("258");



//Codifique un método que seleccione los documentos de la colección países cuya población sea
//mayor a 50000000 y menor a 150000000. Muestre el resultado por pantalla o consola.

async function poblacionDistinta() {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');
        // Construir la consulta para seleccionar los documentos por población
        const query = { poblacion: { $gt: 50000000, $lt: 150000000 } };
        // Ejecutar la consulta y obtener los resultados
        const result = await collection.find(query).toArray();
        // Mostrar el resultado por consola
        console.log('Países con población entre 50,000,000 y 150,000,000:');
        console.log(result);

        return result;
    } catch (error) {
        console.error('Error al seleccionar países por población:', error);
    } 
}

//poblacionDistinta();

//Codifique un método que seleccione los documentos de la colección países ordenados por nombre
//(name) en forma Ascendente. sort(). Muestre el resultado por pantalla o consola.

async function sortNombreAscendente() {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta para seleccionar los documentos y ordenarlos por nombre ascendente
        const query = {};
        const options = { sort: { nombrePais: 1 } }; // 1 para ascendente, -1 para descendente

        // Ejecutar la consulta y obtener los resultados
        const result = await collection.find(query, options).toArray();

        // Mostrar el resultado por consola
        console.log('Países ordenados por nombre de forma ascendente:');
        console.log(result);

        return result;
    } catch (error) {
        console.error('Error al seleccionar y ordenar países por nombre:', error);
    } 
}
//sortNombreAscendente();

/*El método skip() en MongoDB se usa para omitir un número específico de documentos en una colección y obtener los documentos restantes a partir de ese punto. Esta funcionalidad es especialmente útil en situaciones donde necesitas paginar resultados o deseas ignorar cierta cantidad de documentos al realizar consultas.

Imaginemos que tenemos una colección llamada "países" que contiene información detallada sobre diferentes países. Si queremos obtener los países ordenados por nombre, pero queremos ignorar los primeros 15 países, podemos utilizar el método skip(15) para lograrlo. Esto significa que MongoDB omitirá los primeros 15 documentos en la colección y nos devolverá los documentos restantes a partir del decimosexto.

Entonces, al ejecutar skip() sobre la colección "países" con un valor de 15, MongoDB omitirá los primeros 15 países y nos devolverá los países restantes a partir del decimosexto, lo que nos permite obtener los resultados deseados según nuestros criterios de paginación o filtrado. */

async function skip() {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Construir la consulta para obtener países, omitiendo los primeros 5
        const query = {};

        const options = { skip: 15 };
        // Ejecutar la consulta y obtener los resultados
        const result = await collection.find(query, options).toArray();

        // Mostrar el resultado por consola
        console.log('Países después de omitir los primeros 15:');
        console.log(result);

        return result;
    } catch (error) {
        console.error('Error al omitir países:', error);
    } 
}

//skip();

//Describa y ejemplifique como el uso de expresiones regulares en Mongo puede reemplazar
//el uso de la cláusula LIKE de SQL.

/*En MongoDB, las expresiones regulares se utilizan para buscar patrones en los datos, reemplazando la cláusula LIKE de SQL. Por ejemplo, para buscar todos los países cuyo nombre comienza con "United", usaríamos una expresión regular /^United/ en MongoDB, mientras que en SQL sería LIKE 'United%'. Las expresiones regulares en MongoDB ofrecen más flexibilidad y potencia para realizar búsquedas complejas.*/

async function encontrarPaises() {
    try {
        await client.connect();
        const database = client.db("nombre_de_tu_base_de_datos");
        const collection = database.collection("nombre_de_tu_coleccion");

        // Utilizando una expresión regular para buscar países cuyo nombre comience con "United"
        const query = { nombre: /^United/ };
        const result = await collection.find(query).toArray();

        console.log("Países cuyo nombre comienza con 'United':", result);
    } finally {
        await client.close();
    }
}

//encontrarPaises();


//Cree un nuevo índice para la colección países asignando el campo código como índice.
//investigue createIndex())
async function createIndex() {
    try {
        // Conectar al servidor de MongoDB si no está conectado
        await client.connect();

        const db = client.db('paises_db');
        const collection = db.collection('paises');

        // Crear un nuevo índice en el campo codigoPais
        await collection.createIndex({ codigoPais: 1 }, { name: "codigoPais_index" });

        console.log('Índice creado correctamente.');
    } catch (error) {
        console.error('Error al crear el índice:', error);
    } 
}

//createIndex();


//5.6

//Método drop() sobre una colección: Elimina permanentemente una colección y todos sus documentos.
//Método dropDatabase() sobre una base de datos: Borra la base de datos completa, incluidas todas sus colecciones y datos almacenados.

//5.12
//Para realizar un backup de la base de datos MongoDB países_db, puedes usar el comando mongodump en la línea de comandos. Por ejemplo:
//mongodump --db países_db --out /ruta/del/respaldo

