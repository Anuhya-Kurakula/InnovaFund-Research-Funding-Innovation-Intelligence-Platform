def test_get_trends_topics(client):
    r = client.get('/api/v1/trends/topics')
    assert r.status_code == 200
    data = r.json()
    assert 'topics' in data
    assert len(data['topics']) >= 1

def test_get_trends_hotspots(client):
    r = client.get('/api/v1/trends/hotspots')
    assert r.status_code == 200
    data = r.json()
    assert 'hotspots' in data
    assert 'domains' in data
    assert len(data['hotspots']) >= 1
    assert len(data['domains']) >= 1

def test_get_trends_citations(client):
    r = client.get('/api/v1/trends/citations')
    assert r.status_code == 200
    data = r.json()
    assert 'total_publications_analyzed' in data
    assert 'total_citations' in data
    assert 'average_citations_per_paper' in data
    assert 'top_cited_publications' in data
