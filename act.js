const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();

const accountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 6, // limita cada IP a 6 peticiones por el tiempo definido con "windowMs"
  message: "Demasiadas peticiones realizadas, intenta despues de 1 hora",
});

let cuentas = [{
    "usuario": "Rex",
    "contraseña": "Rex123"
}, {
    "usuario": "Haru",
    "contraseña": "Si123"
}];
app.use(express.json());

app.get("/users", accountLimiter, (req, res) => {
  res.send(cuentas);
});

app.post("/create-account", accountLimiter, (req, res) => {
  cuentas.push(req.body);
  res.send("Cuenta creada: " + JSON.stringify(req.body));
});

app.post("/log-account", accountLimiter, (req, res) => {
    const { usuario, contraseña } = req.body;
    cuentas.map((cuenta) => {
        if(cuenta.usuario == usuario && cuenta.contraseña == contraseña) {
            res.send("Ha iniciado sesión");
        }
    });
    res.send("Usuario o contraseña incorrectos");
});

app.delete("/delete-account", accountLimiter, (req, res) => {
  res.send("cuenta borrada: " + cuentas.splice(req.body.id))
});

app.listen(3000, () => console.log(`App ejecutando en puerto :3000`));
