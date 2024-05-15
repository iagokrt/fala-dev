import { expect, test, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'

import request from 'supertest'
import { app } from '../app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  
  afterAll(async () => {
    await app.close()
  })
  
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')

    execSync('npm run knex migrate:latest')
  })

  test('POST - User can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Transação Teste',
        amount: 5000,
        type: 'credit'
      })
      .expect(201)
    // Retorno da resposta espera-se que seja concluído 
  })

  test('GET - User can list all transactions', async () => {
    const createResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Transação Teste',
      amount: 5000,
      type: 'credit'
    })
    
    const cookies  = createResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Transação Teste', 
        amount: 5000
      })
    ])
  })

  test('GET - User can list transaction by Id', async () => {
    const createResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Transação Teste',
      amount: 5000,
      type: 'credit'
    })
    
    // retrieve cookies (for authentication)
    const cookies  = createResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // transaction id
    const id = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
    .get(`/transactions/${id}`)
    .set('Cookie', cookies)
    .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Transação Teste', 
        amount: 5000
      })
    )
  })

  test('GET - User can get summary', async () => {
    const createResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Transação Teste 1',
      amount: 5000,
      type: 'credit'
    })
    
    const cookies  = createResponse.get('Set-Cookie') ?? []

    await request(app.server)
    .post('/transactions').set('Cookie', cookies)
    .send({
      title: 'Transação Teste 2',
      amount: 2000,
      type: 'debit'
    })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000
    })
  })
})
