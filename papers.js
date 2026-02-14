function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

const getArticles = (type) => {
    const content = document.querySelector(".content")

    const createElement = (type, className, inner, where) => {
        const element = document.createElement(type)
        element.className = className
        element.innerHTML = inner
        if(where != null){
            where.appendChild(element)
        }
        return element
    }
    const authorsSTR = (authors) => {
        let res = ``
        for(let i = 0; i < authors.length; i++){
            res += `${authors[i]}${i != authors.length - 1 ? `, ` : ``}`
        }
        return res
    }

    if(type != "all_research") {
        fetch(`papers.json`)
        .then(res => res.json())
        .then(res => {
            const articles = res[type]
            articles.sort((a, b) => {
                // Extract the year part from the string
                
                const yearA = a.date ? parseInt(a.date.split(" ")[0]) : 0;
                const yearB = b.date ? parseInt(b.date.split(" ")[0]) : 0;
              
                // Compare the years
                return yearB - yearA;
              });
    
            for(let i = 0; i < articles.length; i ++){
                const article = createElement("div", `article-view`, ``, null)
                article.id = articles[i].title
                if(articles[i].date != null){
                    const date = createElement("div", `article-date`, articles[i].date, article)
                }
                const column = createElement("div", `article-column`, ``, null)
                const title = createElement("div", `article-title`, articles[i].title.toUpperCase(), column)
                if(articles[i].authors != null  && articles[i].authors.length > 0){
                    const authors = createElement("div", `article-with`, `WITH ${authorsSTR(articles[i].authors)}`, column)
                }
                const publication = createElement("div", `article-at`, articles[i].publication != null ? articles[i].publication : "", column)
                if(articles[i].summary){
                    const summary = createElement("div", `article-sum`, articles[i].summary, column)
                }
                if(articles[i].awards != null){
                    for(let x = 0; x < articles[i].awards.length; x++ ){
                        const award = createElement("div", `article-award`, articles[i].awards[x], column)
                    }
                }
                if(articles[i].pdf_link != null){
                    const pdf = createElement("a", `article-pdf`, `PDF`, column)
                    pdf.href = articles[i].pdf_link
                }
                article.appendChild(column)
                content.appendChild(article)
    
            }

            if(getQueryParam("article") != null) {
                const selected_article = document.getElementById(`${getQueryParam("article")}`)
                console.log(getQueryParam("article"), selected_article)
                if (selected_article) {
                    selected_article.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    
                    
                    
                }
            }
        })
        .catch(error => console.log(error));
    } else {
        fetch(`papers.json`)
        .then(res => res.json())
        .then(res => {
            const published = res["published"]
        published.sort((a, b) => {
            // Extract the year part from the string
            
            const yearA = a.date ? parseInt(a.date.split(" ")[0]) : 0;
            const yearB = b.date ? parseInt(b.date.split(" ")[0]) : 0;
          
            // Compare the years
            return yearB - yearA;
          });
          const working = res["working"]
          working.sort((a, b) => {
            // Extract the year part from the string
            
            const yearA = a.date ? parseInt(a.date.split(" ")[0]) : 0;
            const yearB = b.date ? parseInt(b.date.split(" ")[0]) : 0;
          
            // Compare the years
            return yearB - yearA;
          });
          const articles = published.concat(working)
    
            for(let i = 0; i < articles.length; i ++){
                const article = createElement("a", `article-view`, ``, null)
                article.href = `${res["working"].includes(articles[i]) ? "progress" : "research"}.html?article=${articles[i].title}`
                article.classList.add(`all_research-article`)
                if(articles[i].date != null){
                    const date = createElement("div", `article-date`, articles[i].date, article)
                }
                const column = createElement("div", `article-column`, ``, null)
                const title = createElement("div", `article-title`, articles[i].title.toUpperCase(), column)
                if(articles[i].authors != null  && articles[i].authors.length > 0){
                    const authors = createElement("div", `article-with`, `WITH ${authorsSTR(articles[i].authors)}`, column)
                }
                const publication = createElement("div", `article-at`, articles[i].publication != null ? articles[i].publication : "", column)
                if(res["working"].includes(articles[i])) {
                    createElement("div", `article-working-annot`, "*working paper", column)
                }
                article.appendChild(column)
                content.appendChild(article)
    
            }
        })
        .catch(error => console.log(error));
    }
    
}