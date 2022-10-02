const express = require("express");
const app = express();
const expressFileUpload = require("express-fileupload");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(
    expressFileUpload({
        limits:{ fileSize:5242880 },
        abortOnLimit: true,
        responseOnLimit: "Ups... El archivo es demaciado grande, intenta otra vez 🖥️💥"
    })
)

app.use(express.static("public"));

app.use("/imgs", express.static(__dirname + "/imagen"));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/formulario.html")
})

app.get("/imagen", (req, res) => {
    res.sendFile(__dirname + "/public/collage.html")
})

app.post("/imagen", (req, res) => {
    const{ target_file } = req.files;
    if (target_file.size >= 5 * 1024 * 1024){
        return res.send("Alerta!, se permite hasta 5MB")
    }
    const { posicion } = req.body;
    target_file.mv(`${__dirname}/imagen/imagen-${posicion}.jpg`,(error) =>{
        error ? res.send("Error! Error! Error! al cargar el archivo") : res.redirect("/imagen");
    });
})

app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params
    fs.unlink(`${__dirname}/imagen/${nombre}`, err => {
        if(err){
            if(err.code == 'ENOENT'){
                return res.redirect("/collage.html")
            }
            return res.send("Sorry, ocurrio un error al Eliminar el archivo")
        }
        return res.redirect("/collage.html")
    })
})

app.listen(5000, ()=> {
    console.log("Server UP puerto 5000👌😎🎉")
})