const express=require('express');
const dotenv=require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');


dotenv.config();


const app=express();

app.use(cors(
  { origin: '*', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/agents', require('./routes/agentRoutes'));
app.use('/api/lists', require('./routes/listRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server is running on part ${PORT}`);
    connectDB();
})

module.exports=app;

