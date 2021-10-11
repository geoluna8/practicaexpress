
// importando dependencias
const Express = require("express");
const { connect } = require("mongoose");
const cors = require('cors');
// llamando al
const { agenda } = require("./schema.js");
const FakeData = require("./fakeData.json");
const { response, request } = require("express");

//Le decimos al server donde esta la carpeta del front
const Server = Express();
Server.use(Express.static("public"));

// configure app to use bodyParser()
// this will let us get the data from a POST
Server.use(require('body-parser').urlencoded({extended: false}));
Server.use(require('body-parser').json());

Server.use(cors({origin: '*'}));

// Parametros de conexion
const USER = "root";
const PASSWORD = "geovanny8";
const DATA_BASE = "myFirstDatabase";

// Preparando cadena de conexion
const CONECTOR = `mongodb+srv://${USER}:${PASSWORD}@cluster0.w53ip.mongodb.net/${DATA_BASE}?retryWrites=true&w=majority`;
const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

//Ruta por default
Server.get('/api', (req, res) => {
    res.send("Welcome to Geovanny's Express Server");
});

// Router para consultar todos los datos generados.
Server.get("/api/consulta", (request, response) => {
 
    // Generamos una busqueda completa.
    console.log("consulta");
    agenda.find({}, (error, data) => {
        // En caso de error mostramos el problema
        if (error) {
            response.status(404);
            response.json(error);
        } else {
             // en caso de que todo salga correcto enviamos la respuesta.
            response.status(200);
            response.json(data);
        }
    });
});

//Router para dar de alta un registro
Server.post("/api/alta", (request, response) => {

    console.log("alta", request.body);

        const DATA = {
            name: request.body.name,
            lastName: request.body.lastName,
            age: request.body.age,
            random: 0
        };
    
    // Se indica que se crea un nuevo registro
    const AGEMDA = new agenda(DATA);

    // Se recibe la respuesta generada al crear un nuevo registro.
    AGEMDA.save((error, data) => {
        // En caso de error mostramos el problema
        if (error) {
            response.status(404);
            response.json(error);
        } else {
            // en caso de que todo salga correcto enviamos la respuesta.
            response.status(200);
            response.json(data);
            //response.json({ message: 'Persona creada!'});
        }
    });

}); 

//ruta para obtener un registro por id
Server.post('/api/getone', (request, response) => {
    console.log('buscar: ', request.body);
    // { <field>: { $eq: <value> } }
    agenda.findOne({_id:{$eq: request.body._id}}, (error, data) => {
            if(error){
                console.log(error);
            } else {
                response.send(data);
            }
        });
});


//ruta para hacer update
Server.put('/api/actualizar', (request, response) => {

    console.log('actualizar: ', request.body)

    agenda.findByIdAndUpdate(request.body._id, {
        name:request.body.name,
        lastName: request.body.lastName,
        age:request.body.age
    }, (error, data) => {
        if (error) {
            response.status(404);
            response.json(error);
        } else {
            response.status(200);
            response.json(data);
        }
    });
});

//Ruta para borrar un registro por id
Server.delete('/api/borrar/:persona_id', (request, response)=> {
    console.log('borrar: ', request.params.persona_id);

    agenda.findByIdAndDelete((request.params.persona_id), 
    function(error, data) {
        if(error){
            response.status(404);
            response.json(error);
        } else {
            response.status(200);
            response.json({ message: 'Successfully deleted' });
        }

    });
});


// Router para crear datos de manera aleatoria
Server.use("/random", (request, response) => {
    // Se consiguen los nodos del archivo FakeData
    const { names, lastNames } = FakeData;
    // Consiguiendo un index de manera aleatoria
    const NAME = Math.floor(Math.random() * (names.length - 0));
    const LAST_NAME = Math.floor(Math.random() * (lastNames.length - 0));
    // Preparando los datos que seran enviados a mongodb
    const DATA = {
        name: names[NAME],
        lastName: lastNames[LAST_NAME],
        age: NAME * 2,
        random: NAME * LAST_NAME
    };

    // Se indica que se crea un nuevo registro
    const AGEMDA = new agenda(DATA);

    // Se recibe la respuesta generada al crear un nuevo registro.
    AGEMDA.save((error, data) => {
        // En caso de error mostramos el problema
        if (error) {
            response.status(404);
            response.json(error);
        } else {
            // en caso de que todo salga correcto enviamos la respuesta.
            response.status(200);
            response.json(data);
        }
    });
});

// Abriendo la conexión a mongoDB Atlas
connect(CONECTOR, OPTIONS, MongoError => {
        // si algo sale mal mostramos el error y paramos el servidor
        if (MongoError) {
            console.error(MongoError);
            process.exit(1);
        }
        // se inicia el servidor
        var port = process.env.PORT||8080;
        Server.listen(port, error => {
            // En caso de error indicamos el problemas
            if (error) {
                console.error(error);
                process.exit(1);
            }
            console.log("Conexión establecida con MongoDB Altas");
            console.log("Servidor listo");
        });
    }
);