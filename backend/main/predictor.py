from urllib.request import Request, urlopen
from urllib.parse import quote
from json import loads, dumps
from numpy import nan, isnan
from warnings import warn
from datetime import datetime
from dateutil.relativedelta import relativedelta
from statsmodels.tsa.arima.model import ARIMA
import pandas as pd


# import ssl
# ssl._create_default_https_context = ssl._create_unverified_context

TOWNS = ['PUNGGOL', 'JURONG WEST', 'BEDOK', 'BUKIT MERAH', 'CHOA CHU KANG', 'TAMPINES',
         'SENGKANG', 'ANG MO KIO', 'HOUGANG', 'TOA PAYOH', 'JURONG EAST', 'WOODLANDS',
         'BUKIT BATOK', 'SEMBAWANG', 'CENTRAL', 'QUEENSTOWN', 'BISHAN', 'CLEMENTI',
         'MARINE PARADE', 'PASIR RIS', 'YISHUN', 'GEYLANG', 'SERANGOON',
         'BUKIT PANJANG', 'KALLANG/WHAMPOA', 'BUKIT TIMAH']
FLAT_TYPE = ['1-ROOM', '2-ROOM', '3-ROOM', '4-ROOM', '5-ROOM', 'EXECUTIVE']

def rent_predictor(months:int =0, town=None, flat_type=None):
    assert months >= 0
    filters={}
    if town is not None: 
        assert town in TOWNS
        filters['town'] = town
    if flat_type is not None:
        assert flat_type in FLAT_TYPE
        filters['flat_type'] = flat_type
    url_cur = 'https://data.gov.sg/api/action/datastore_search?resource_id=9caa8451-79f3-4cd6-a6a7-9cecc6d59544&limit=77000'
    url_hist = 'https://data.gov.sg/api/action/datastore_search?resource_id=6b1ec2ff-7c38-4ce9-9bbb-af865b4d78cb&limit=10500'
    if bool(filters): 
        filters = dumps(filters)
        url_cur += f'&filters={filters}'
        url_hist += f'&filters={filters.replace("OO", "").replace("UTIVE", "")}'
    
    req = Request(
        quote(url_cur, safe=':/?&='), 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    
    rent_cur = pd.DataFrame(loads(urlopen(req).read().decode("utf-8").replace('ROOM', 'RM').replace('UTIVE', ''))["result"]["records"])
    
    req = Request(
        quote(url_hist, safe=':/?&='), 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    
    rent_hist = pd.DataFrame(loads(urlopen(req).read().decode("utf-8"))["result"]["records"])
    
    def Q_to_month(s: str):
        year, month = s[:4], int(s[-1:])
        month = 3*month-1
        return f"{year}-{month:02}"
    
    if rent_cur.empty:
        if flat_type is not None:
            warn('Not enough data to predict specified flat type; Expanding data to all flat types')
            return rent_predictor(months, town=town, flat_type=None)
        else:
            warn('Not enough data to perform prediction')
            return

    rent_hist["quarter"] = rent_hist["quarter"].apply(Q_to_month)
    rent_hist["quarter"] = rent_hist["quarter"].apply(lambda date: datetime.strptime(date, "%Y-%m"))
    rent_hist["median_rent"] = rent_hist["median_rent"].apply(lambda r: int(r) if r.isdigit() else nan)
    rent_cur["monthly_rent"] = rent_cur["monthly_rent"].apply(lambda r: int(r) if r.isdigit() else nan)    
    rent_cur["rent_approval_date"] = rent_cur["rent_approval_date"].apply(lambda date: datetime.strptime(date, "%Y-%m"))
    
    rent_hist = rent_hist[rent_hist["quarter"] < rent_cur["rent_approval_date"].min()]
    data = []
    for date in rent_hist["quarter"].unique():
        med = rent_hist[rent_hist["quarter"] == date]["median_rent"].median(skipna=True)
        if isnan(med): continue
        data.append((date, med))
    for date in rent_cur["rent_approval_date"].unique():
        med = rent_cur[rent_cur["rent_approval_date"] == date]["monthly_rent"].median(skipna=True)
        if isnan(med): continue
        data.append((date, med))
    
    
    data = pd.DataFrame(data, columns= ['date', 'median_rent'])
    data.set_index('date', inplace=True)
    data.index = data.index.to_period('M')
    data = data.sort_index()
    
    model = ARIMA(data, order=(5, 1, 2))
    results = model.fit()
    future = results.predict(steps=months, start=datetime.now()-relativedelta(months=1), end=datetime.now()+relativedelta(months=months)).to_frame().reset_index()
    future['index'] = future['index'].apply(lambda date: datetime.strptime(date.strftime("%Y-%m"), "%Y-%m"))
    future = future[future['index'] > datetime.now()-relativedelta(months=1)]
    future.set_index('index', inplace=True)
    return future

def resale_predictor(months:int =0, town=None, flat_type=None):
    assert months >= 0
    filters={}
    if town is not None: 
        assert town in TOWNS
        filters['town'] = town
    if flat_type is not None:
        assert flat_type in FLAT_TYPE
        filters['flat_type'] = flat_type
    tags = ['adbbddd3-30e2-445f-a123-29bee150a6fe',
            '8c00bf08-9124-479e-aeca-7cc411d884c4',
            '83b2fc37-ce8c-4df4-968b-370fd818138b',
            '1b702208-44bf-4829-b620-4615ee19b57c',
            'f1765b54-a209-4718-8d38-a39237f502b3']
    resale_prices = []
    for tag in tags:
        url = f"https://data.gov.sg/api/action/datastore_search?resource_id={tag}&limit=500000"
        if bool(filters): url += f"&filters={dumps(filters).replace('-', ' ')}"
        req = Request(
            quote(url, safe=':/?&='), 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        df = pd.DataFrame(loads(urlopen(req).read().decode("utf-8"))["result"]["records"])
        if not df.empty: resale_prices.append(pd.DataFrame(loads(urlopen(req).read().decode("utf-8"))["result"]["records"])[['month', 'resale_price']])
    if len(resale_prices) == 0:
        if flat_type is not None:
            warn("Not enough data to predict specified flat type; Expanding data to all flat types")
            return resale_predictor(months, town, flat_type=None)
        else:
            warn('Not enough data to perform prediction')
            return            
        
    resale_prices = pd.concat(resale_prices)
    data = []
    for month in resale_prices['month'].unique():
        data.append((month, resale_prices[resale_prices['month'] == month]['resale_price'].median(skipna=True)))
    data = pd.DataFrame(data, columns= ['date', 'median_resale'])
    data["date"] = data["date"].apply(lambda date: datetime.strptime(date, "%Y-%m"))
    data.set_index('date', inplace=True)
    data.index = data.index.to_period('M')
    data = data.sort_index()
    model = ARIMA(data, order=(5, 1, 2))
    results = model.fit()
    future = results.predict(steps=months, start=datetime.now()-relativedelta(months=1), end=datetime.now()+relativedelta(months=months)).to_frame().reset_index()
    future['index'] = future['index'].apply(lambda date: datetime.strptime(date.strftime("%Y-%m"), "%Y-%m"))
    future = future[future['index'] > datetime.now()-relativedelta(months=1)]
    future.set_index('index', inplace=True)
    return future

def rent_mean(town=None, flat_type=None):
    
    filters={}
    if town is not None: 
        assert town in TOWNS
        filters['town'] = town
    if flat_type is not None:
        assert flat_type in FLAT_TYPE
        filters['flat_type'] = flat_type

    url_cur = 'https://data.gov.sg/api/action/datastore_search?resource_id=9caa8451-79f3-4cd6-a6a7-9cecc6d59544&limit=77000'

    if bool(filters): 
        filters = dumps(filters)
        url_cur += f'&filters={filters}'
    
    req = Request(
        quote(url_cur, safe=':/?&='), 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    
    rent_cur = pd.DataFrame(loads(urlopen(req).read().decode("utf-8").replace('ROOM', 'RM').replace('UTIVE', ''))["result"]["records"])
    if rent_cur.empty:
        return -1
    rent_cur = rent_cur[rent_cur["rent_approval_date"] >= "2022"]
    rent_cur["monthly_rent"] = rent_cur["monthly_rent"].astype(float)
    return rent_cur["monthly_rent"].mean()

def resale_mean(town=None, flat_type=None):
    
    filters={}
    if town is not None: 
        assert town in TOWNS
        filters['town'] = town
    if flat_type is not None:
        assert flat_type in FLAT_TYPE
        filters['flat_type'] = flat_type
    tags = ['f1765b54-a209-4718-8d38-a39237f502b3']
    resale_prices = []
    for tag in tags:
        url = f"https://data.gov.sg/api/action/datastore_search?resource_id={tag}&limit=500000"
        if bool(filters): url += f"&filters={dumps(filters).replace('-', ' ')}"
        req = Request(
            quote(url, safe=':/?&='), 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        df = pd.DataFrame(loads(urlopen(req).read().decode("utf-8"))["result"]["records"])
        if not df.empty: resale_prices.append(pd.DataFrame(loads(urlopen(req).read().decode("utf-8"))["result"]["records"])[['month', 'resale_price']])
    if df.empty:
        return -1
    df = df[df["month"] >= "2021"]
    df["resale_price"] = df["resale_price"].astype(float)
    return df["resale_price"].mean()