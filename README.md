git pull 이후

npm install  : 사용 모듈 설치

package.json에

"scripts": {
    "start": "nodemon ./bin/www"  nodemon으로 되어있음 ( nodenmon 사용 안하시려면 node로 수정)
  },

디렉토리 구조
config : 설정 파일들 있는곳 ( mysql config)
db : DB 관련 js
doc : 간단 문서 생성 저장하는 곳 ( groc 사용중 )
middle : 미들웨어나 공용 객체 저장하는 곳
node_modules : npm 모듈들 있는곳
public : 공용으로 사용되는 리소스 및 css 
routes : 핵심! 라우터 설정 및 실제 작업 하는 곳
views : 뷰 페이지 ( 사용 안함 )

.groc.json : groc 관련 설정 파일


routes 기본 구조

URL 호출에 따른 디렉토리 구조를 가짐

예로 /api/users에 프로토콜 요청을 만들고 싶을 경우

1) routes/api 폴더 추가
2) routes/api에 index.js 추가 
3) routes/api/users 폴더 추가
4) routes/api/users index.js 추가
5) routes/api/index.js에 routes/api/users/index.js 라우터 객체 use ( 연결 )

위 구조 방식으로 할 시

1) 프로토콜 단위로 디렉토리 구분 하기에 공동작업시 충돌 최소화
2) 요청한 URL만 알면 쉽게 프로토콜 파일 검색 가능