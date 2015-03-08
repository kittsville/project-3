:- use_module(library(clpfd)).
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
 
sudoku(Rows) :- 
  append(Rows, Vs), Vs ins 1..9,
  maplist(all_distinct, Rows),
  transpose(Rows, Columns),    
  maplist(all_distinct, Columns),    
  Rows = [A,B,C,D,E,F,G,H,I],    
  blocks(A, B, C), blocks(D, E, F), blocks(G, H, I),    
  maplist(label, Rows).     
 
blocks([], [], []).      
blocks([A,B,C|Bs1], [D,E,F|Bs2], [G,H,I|Bs3]) :-    
  all_distinct([A,B,C,D,E,F,G,H,I]),     
  blocks(Bs1, Bs2, Bs3).
  
problem(1, [[_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,3,_,8,5],
            [_,_,1,_,2,_,_,_,_],
            [_,_,_,5,_,7,_,_,_],
            [_,_,4,_,_,_,1,_,_],
            [_,9,_,_,_,_,_,_,_],
            [5,_,_,_,_,_,_,7,3],
            [_,_,2,_,1,_,_,_,_],
            [_,_,_,_,4,_,_,_,9]]).

server(Port) :-
        http_server(http_dispatch, [port(Port)]).
		
:- http_handler('/', http_reply_file('home.html', []),[]).
:- http_handler('/sudoku.css', http_reply_file('sudoku.css', []), []).
:- http_handler('/sudoku.js', http_reply_file('sudoku.js', []),[]).
:- http_handler('/puzzles.js', http_reply_file('puzzles.js', []),[]).
:- http_handler('scripts/sudoku.js', http_reply_file('sudoku.js', []),[]).
:- http_handler('scripts/puzzles.js', http_reply_file('puzzles.js', []),[]).
output(_Request) :-
        format('Content-type: text/html~n~n'),
        format('Hello World!~n').
