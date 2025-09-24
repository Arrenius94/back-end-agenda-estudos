import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer")) {
    return res.status(401).json({ error: "Token não fornecido!" });
  }

  const token = auth.split(" ")[1];

  try {
    const codejwt = jwt.verify(token, process.env.JWT_SECRET);
    req.user = codejwt;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado!" });
  }
}
