const request=require('supertest')
  , should=require('should')
  , app=require('../server/app')

describe('app.js',()=>{
    it('GET /',(done)=>{
        request(app)
            .get('/')
            .expect('Content-Type',/html/)
            .expect(200)
            .end((err,res)=>{
                res.statusCode.should.be.eql(200);
                done();
            });
    });

    it('GET /scores',(done)=>{
        request(app)
            .get('/scores')
            .expect('Content-Type',/json/)
            .expect(200)
            .end((err,res)=>{
                res.statusCode.should.be.eql(200);
                res.body.should.be.an.Object();
                res.body.should.have.an.Array();
                for(let i in res.body){
                    res.body[i].should.have.property('player').and.be.String();
                    res.body[i].should.have.property('score').and.be.Number();
                }
                done();
            });
    });

    it('POST /score',(done)=>{
        request(app)
            .post('/score')
            .send({
                player:'TEST'
              , score:45
            })
            .expect('Content-Type',/json/)
            .expect(200)
            .end((err,res)=>{
                res.statusCode.should.be.eql(200);
                res.body.should.be.Object();
                res.body.should.have.property('ok').and.be.true;
                done();
            });
    });
});

