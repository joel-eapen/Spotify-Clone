const jwt = require('jsonwebtoken');

const authArtist = async (req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Unauthorized'})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.role !== 'artist'){
            return res.status(403).json({message:'You have no access to this resource'})
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message:'Unauthorized',
            error:error.message
        })   
    }
    
} ;

const authUser = async (req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Unauthorized'})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.role !== 'user'){
            return res.status(403).json({message:'You are not a user or artist'})
        }
        next();
    } catch (error) {
        return res.status(401).json({
            message:'Unauthorized',
            error:error.message
        })
    }
}

module.exports = { authArtist, authUser }