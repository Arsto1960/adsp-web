import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { Main } from './pages/main/main';
import { Landingpage } from './pages/landingpage/landingpage';
import { Chapter1 } from './components/chapter1/chapter1';
import { Chapter2 } from './components/chapter2/chapter2';
import { Chapter3 } from './components/chapter3/chapter3';
import { Chapter4 } from './components/chapter4/chapter4';
import { Chapter8 } from './components/chapter8/chapter8';
import { Chapter12 } from './components/chapter12/chapter12';
import { Chapter11 } from './components/chapter11/chapter11';
import { Chapter10 } from './components/chapter10/chapter10';
import { Chapter7 } from './components/chapter7/chapter7';
import { Chapter5 } from './components/chapter5/chapter5';
import { Chapter6 } from './components/chapter6/chapter6';
import { Chapter9 } from './components/chapter9/chapter9';
import { Bibliography } from './components/bibliography/bibliography';
import { Lab1 } from './subtopics/chap1/lab1/lab1';
import { Lab2 } from './subtopics/chap2/lab2/lab2';
import { Subtopic1 } from './subtopics/chap2/subtopic1/subtopic1';
import { Subtopic2 } from './subtopics/chap2/subtopic2/subtopic2';
import { Subtopic13 } from './subtopics/chap2/subtopic1.3/subtopic1.3';
import { Lab7 } from './subtopics/chap7/lab7/lab7';
import { Subtopic71 } from './subtopics/chap7/subtopic71/subtopic71';
import { Subtopic72 } from './subtopics/chap7/subtopic72/subtopic72';
import { Subtopic81 } from './subtopics/chap8/subtopic81/subtopic81';
import { Subtopic82 } from './subtopics/chap8/subtopic82/subtopic82';
import { Subtopic83 } from './subtopics/chap8/subtopic83/subtopic83';
import { Lab8 } from './subtopics/chap8/lab8/lab8';
import { Lab3 } from './subtopics/chap3/lab3/lab3';
import { Subtopic31 } from './subtopics/chap3/subtopic31/subtopic31';
import { Subtopic32 } from './subtopics/chap3/subtopic32/subtopic32';
import { Lab9 } from './subtopics/chap9/lab9/lab9';
import { Subtopic101 } from './subtopics/chap10/subtopic101/subtopic101';
import { Subtopic102 } from './subtopics/chap10/subtopic102/subtopic102';
import { Subtopic103 } from './subtopics/chap10/subtopic103/subtopic103';
import { Lab10 } from './subtopics/chap10/lab10/lab10';
import { Lab12 } from './subtopics/chap12/lab12/lab12';
import { Lab11 } from './subtopics/chap11/lab11/lab11';
import { Subtopic111 } from './subtopics/chap11/subtopic111/subtopic111';
import { Subtopic112 } from './subtopics/chap11/subtopic112/subtopic112';
import { Subtopic113 } from './subtopics/chap11/subtopic113/subtopic113';
import { Subtopic121 } from './subtopics/chap12/subtopic121/subtopic121';
import { Subtopic122 } from './subtopics/chap12/subtopic122/subtopic122';
import { Subtopic123 } from './subtopics/chap12/subtopic123/subtopic123';
import { Subtopic124 } from './subtopics/chap12/subtopic124/subtopic124';
import { Subtopic125 } from './subtopics/chap12/subtopic125/subtopic125';
import { Subtopic126 } from './subtopics/chap12/subtopic126/subtopic126';
import { Subtopic127 } from './subtopics/chap12/subtopic127/subtopic127';
import { Subtopic128 } from './subtopics/chap12/subtopic128/subtopic128';
import { Subtopic129 } from './subtopics/chap12/subtopic129/subtopic129';
import { Subtopic1210 } from './subtopics/chap12/subtopic1210/subtopic1210';
import { Lab4 } from './subtopics/chap4/lab4/lab4';
import { Lab5 } from './subtopics/chap5/lab5/lab5';
import { Lab6 } from './subtopics/chap6/lab6/lab6';
import { Lp } from './components/lp/lp';
import { St61 } from './subtopics/chap6/st61/st61';
import { St62 } from './subtopics/chap6/st62/st62';
import { St63 } from './subtopics/chap6/st63/st63';
import { Id1 } from './subtopics/chap1/id1/id1';
import { Id3 } from './subtopics/chap3/id3/id3';
import { Id5 } from './subtopics/chap5/id5/id5';
import { Id6 } from './subtopics/chap6/id6/id6';
import { Id7 } from './subtopics/chap7/id7/id7';
import { Id8 } from './subtopics/chap8/id8/id8';

const routerOptions: ExtraOptions = {
    scrollPositionRestoration: 'enabled', // restores scroll to top on navigation
    anchorScrolling: 'enabled',           // optional, scrolls to anchor if URL has #anchor
};

export const routes: Routes = [
    { path: '', component: Lp },
    { path: 'lp', component: Lp },  // Default route
    {
        path: 'main',
        component: Main,
        children: [
            { path: '', redirectTo: 'chapter1', pathMatch: 'full' },
            { path: 'chapter1', component: Chapter1 },
            { path: 'chapter1/lab1', component: Lab1 },
             { path: 'chapter1/id1', component: Id1 },

            { path: 'chapter2', component: Chapter2 },
            { path: 'chapter2/lab2', component: Lab2 },
            { path: 'chapter2/subtopic1', component: Subtopic1 },
            { path: 'chapter2/subtopic2', component: Subtopic2 },
            { path: 'chapter2/subtopic1.3', component: Subtopic13 },
            

            { path: 'chapter3', component: Chapter3 },
            { path: 'chapter3/lab3', component: Lab3 },
            { path: 'chapter3/subtopic31', component: Subtopic31 },
            { path: 'chapter3/subtopic32', component: Subtopic32 },
             { path: 'chapter3/id3', component: Id3 },


            { path: 'chapter4', component: Chapter4 },
            { path: 'chapter4/lab4', component: Lab4 },

            { path: 'chapter5', component: Chapter5 },
            { path: 'chapter5/lab5', component: Lab5 },
             { path: 'chapter5/id5', component: Id5 },

            { path: 'chapter6', component: Chapter6 },
            { path: 'chapter6/lab6', component: Lab6 },
            { path: 'chapter6/st61', component: St61 },
            { path: 'chapter6/st62', component: St62 },
            { path: 'chapter6/st63', component: St63 },
             { path: 'chapter6/id6', component: Id6 },


            { path: 'chapter7', component: Chapter7 },
            { path: 'chapter7/subtopic71', component: Subtopic71 },
            { path: 'chapter7/subtopic72', component: Subtopic72 },
            { path: 'chapter7/lab7', component: Lab7 },
             { path: 'chapter7/id7', component: Id7 },

            { path: 'chapter8', component: Chapter8 },
            { path: 'chapter8/subtopic81', component: Subtopic72 },
            { path: 'chapter8/subtopic81', component: Subtopic81 },
            { path: 'chapter8/subtopic82', component: Subtopic82 },
            { path: 'chapter8/subtopic83', component: Subtopic83 },
            { path: 'chapter8/lab8', component: Lab8 },
            { path: 'chapter8/id8', component: Id8 },


            { path: 'chapter9', component: Chapter9 },
            { path: 'chapter9/lab9', component: Lab9 },


            { path: 'chapter10', component: Chapter10 },
            { path: 'chapter10/subtopic101', component: Subtopic101 },
            { path: 'chapter10/subtopic102', component: Subtopic102 },
            { path: 'chapter10/subtopic103', component: Subtopic103 },
            { path: 'chapter10/lab10', component: Lab10 },


            { path: 'chapter11', component: Chapter11 },
            { path: 'chapter11/subtopic111', component: Subtopic111 },
            { path: 'chapter11/subtopic112', component: Subtopic112 },
            { path: 'chapter11/subtopic113', component: Subtopic113 },
            { path: 'chapter11/lab11', component: Lab11 },

            { path: 'chapter12', component: Chapter12 },
            { path: 'chapter12/lab12', component: Lab12 },
            { path: 'chapter12/subtopic121', component: Subtopic121 },
            { path: 'chapter12/subtopic122', component: Subtopic122 },
            { path: 'chapter12/subtopic123', component: Subtopic123 },
            { path: 'chapter12/subtopic124', component: Subtopic124 },
            { path: 'chapter12/subtopic125', component: Subtopic125 },
            { path: 'chapter12/subtopic126', component: Subtopic126 },
            { path: 'chapter12/subtopic127', component: Subtopic127 },
            { path: 'chapter12/subtopic128', component: Subtopic128 },
            { path: 'chapter12/subtopic129', component: Subtopic129 },
            { path: 'chapter12/subtopic1210', component: Subtopic1210 },



            { path: 'bibliography', component: Bibliography },



        ],
    }
];

