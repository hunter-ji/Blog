## 一. 增

```python
article = Article(title='article1', content='heihei')
db.session.add(article)
db.session.commit()
```

若要在新增之后获取数据库中新增数据的信息，如`id`。

```python
article = Article(title='article1', content='heihei')
db.session.add(article)
db.session.flush() # 添加这一条，用于预提交
db.session.commit()

# 输出新增数据的信息
print(article.id)
print(article.title)
```



## 二. 删

```python
# 1.把需要删除的数据查找出来
article = Article.query.filter_by(content = 'heihei').first()

# 2.把这条数据删除掉
db.session.delete(article)

# 3.提交
db.session.commit()
```



## 三. 改

```python
# 1.先把你要更改的数据查找出来
article = Article.query.filter(Article.title == 'article1').first()

# 2.把这条数据需要修改的地方进行修改
article.title = 'article2'

# 3.提交
db.session.commit()
```



## 四. 查

### 1. 查询单个

```python
article1 = Article.query.filter(Article.title == 'article').first()
article1 = Article.query.filter_by(title = 'article').first() # 或者

print(article1.title)
print(article1.content)
```

### 2. 查询所有

```python
article1 = Article.query.filter_by(title = 'article').all()
for item in article1:
  print(item.title)
  print(item.content)
```

### 3. 倒叙

```python
article1 = Article.query.filter_by(title = 'article').order_by(Article.id.desc()).all()
```

### 4. 限制数量

```python
article1 = Article.query.filter_by(title = 'article').limit(10).all()
```









