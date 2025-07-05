import requests
import json
import time

def fetch_stock_list():
    stock_data = []
    page = 1
    page_size = 100

    while True:
        url = (
            f"https://48.push2.eastmoney.com/api/qt/clist/get"
            f"?pn={page}&pz={page_size}"
            f"&fs=m:1+t:2,m:1+t:23,m:0+t:6,m:0+t:80"
            f"&fields=f12,f14"
        )

        headers = {
            "Referer": "https://quote.eastmoney.com/center/gridlist.html",
            "User-Agent": "Mozilla/5.0"
        }

        try:
            res = requests.get(url, headers=headers, timeout=10)
            res.encoding = 'utf-8'
            result = res.json()

            # DEBUG: print raw structure once
            if page == 1:
                print(json.dumps(result, indent=2, ensure_ascii=False))

            data = result.get("data", {})
            if not data or not data.get("diff"):
                break

            raw_diff = data["diff"]

            if isinstance(raw_diff, str):
                raw_diff = json.loads(raw_diff)

            if not raw_diff:
                break

            for s in raw_diff.values():

                stock_data.append({
                    "code": s["f12"],
                    "name": s["f14"]
                })

            print(f"Page {page} done. Total collected: {len(stock_data)}")
            page += 1
            time.sleep(0.5)

            if page > 100:
                break

        except Exception as e:
            print(f"Error on page {page}: {e}")
            break

    with open("china_stock_list.json", "w", encoding="utf-8") as f:
        json.dump(stock_data, f, ensure_ascii=False, indent=2)

    print(f"\nFinished! {len(stock_data)} stocks saved to china_stock_list.json")


if __name__ == "__main__":
    fetch_stock_list()
