const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { Thread } = require('../models');
let thread_id;
let reply_id;
chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('1创建一个新的主题：发送 POST 请求到 /api/threads/{board}',(done)=>{
        chai.request(server)
        .post('/api/threads/111')
        .send({
            delete_password:
            '333',
            text:
            '222'
        })
        .end((req,res)=>{
            assert.equal(res.status,200);
            assert.equal(res.body.text,'222');
            thread_id=res.body._id

        })
        done();
    })
    test('2查看最近的 10 个主题，每个主题有 3 个回复：发送 GET 请求到 /api/threads/{board}',(done)=>{
        chai.request(server)
        .get('/api/threads/111')
        .end((req,res)=>{
            assert.equal(res.status,200);
            // assert.equal(res.body.text,'222');    
        })
        done();
    })
    test('3使用错误密码删除主题：使用错误的 delete_password 向 /api/threads/{board} 发出 DELETE 请求',(done)=>{
        chai.request(server)
        .delete('/api/threads/111')
        .send({
            delete_password:
            '444',
            thread_id
        })
        .end((req,res)=>{
            assert.equal(res.status,200);
            assert.equal(res.text,'incorrect password');
           

        })
        done();
    })
    test('4使用正确密码删除主题：使用正确的 delete_password 向 /api/threads/{board} 发出 DELETE 请求',(done)=>{
        chai.request(server)
        .delete('/api/threads/111')
        .send({
            delete_password:
            '222',
            thread_id
        })
        .end((req,res)=>{
            assert.equal(res.status,200);
            assert.equal(res.text,'success');
           

        })
        done();
    })
    test('5报告一个主题：发送 PUT 请求到 /api/threads/{board}',(done)=>{
        chai.request(server)
        .put('/api/threads/111')
        .send({
            board:
            '111',
            thread_id
        })
        .end((req,res)=>{
            assert.equal(res.status,200);
            assert.equal(res.text,'reported');
           

        })
        done();
    })
    test('6创建一个新的回复：发送 POST 请求到 /api/replies/{board}',(done)=>{
        chai.request(server)
        .post('/api/replies/111')
        .send({
            delete_password:'BBB',
            thread_id,
            text:'AAA'
        })
        .end((req,res)=>{
            assert.equal(res.status,200);
            reply_id=res.body._id;
            // assert.equal(res.text,'reported');
           

        })
        done();
    })
    test('7查看一个带有所有回复的主题：发送 GET 请求到 /api/replies/{board}',(done)=>{
        chai.request(server)
        .get('/api/replies/111')
        .end((req,res)=>{
            assert.equal(res.status,200);
            // assert.equal(res.text,'reported');
           

        })
        done();
    })
    test('8使用错误密码删除回复：使用无效的 delete_password 向 /api/replies/{board} 发出 DELETE 请求',(done)=>{
        chai.request(server)
        .delete('/api/replies/111')
        .send({
            delete_password:
            '444',
            thread_id,reply_id
        })
        .end((req,res)=>{
            assert.equal(res.status,200);
            assert.equal(res.text,'incorrect password');
           

        })
        done();
    })
    test('9使用正确密码删除回复：使用有效的 delete_password 向 /api/replies/{board} 发出 DELETE 请求',(done)=>{
        chai.request(server)
        .delete('/api/replies/111')
        .send({
            delete_password:
            'BBB',
            thread_id,reply_id
        })
        .end((req,res)=>{
            assert.equal(res.status,200);
            assert.equal(res.text,'incorrect password');
           

        })
        done();
    })
    test('10报告一个回复：发送 PUT 请求到 /api/replies/{board}',(done)=>{
        chai.request(server)
        .put('/api/replies/111')
        .send({
            board:
            '111',
            thread_id,reply_id
        })
        .end((req,res)=>{
            assert.equal(res.status,200);
            assert.equal(res.text,'reported');
           

        })
        done();
    })
    

});
