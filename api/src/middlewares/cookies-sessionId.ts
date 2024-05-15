import { FastifyRequest, FastifyReply } from "fastify"

export async function checkSessionExists(request:FastifyRequest , reply: FastifyReply) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Usuário não está autorizado a realizar essa ação'
    })
  }
}