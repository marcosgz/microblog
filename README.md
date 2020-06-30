# MicroBlog

Este projeto foi desenvolvido para a materia de `LINGUAGEM DE PROGRAMACAO II`, a fim de demonstrar os conhecimentos obtidos durante a semestre. Trata-se de um MicroBlog onde o usuário pode escrever um tweet e postá-lo, o mesmo tambem pode excluir e editar o tweet. Tambem é possivel atualizar a lista de tweets.

**Funcionalidades implementada:** Adicionar tweet, consutar tweets, editar tweet e deletar tweet.

## Equipe

* Marcos G. Zimmermann
* Ariel Sam

## Tecnologias Utilizadas

**REST API:**: Existe duas opções de backend. A [primeira](backend-node/) mais simples é um framework nodejs que cria emula uma REST api. A [segunda](backend-rack/) é uma API escrita em ruby puro usando apenas o [rack](https://github.com/rack/rack) webservice. Dessa forma fica implementado tudo manualmente.

**Frontend:**: Foi feito uma pagina similar ao twitter. Não foi feito uso de nenhum framework Javascript e CSS. Apenas foi utilizada uma pequena lib chamada [ajax](https://github.com/fdaciuk/ajax) que deixa o código mais legível do que usar `XMLHttpRequest`. Além do [fontawesome](http://fontawesome.com) como pacote de ícones.


* [Backend em Node](backend-node/)
* [Backend em Ruby](backend-rack/)
* [Frontend](frontend/)
