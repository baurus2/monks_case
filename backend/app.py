from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import pandas as pd
import os
import bcrypt

app = Flask(__name__,
            template_folder=os.path.join(os.path.dirname(__file__), '../frontend/templates'),
            static_folder=os.path.join(os.path.dirname(__file__), '../frontend/static'))
app.secret_key = os.environ.get('FLASK_SECRET', 'troque_esta_chave_em_producao')

BASE_DIR = os.path.dirname(__file__)
USERS_CSV = os.path.join(BASE_DIR, 'data', 'users.csv')
DATA_CSV = os.path.join(BASE_DIR, 'data', 'metrics.csv')

users_df = pd.read_csv(USERS_CSV) if os.path.exists(USERS_CSV) else pd.DataFrame(columns=['email','password_hash','role'])
data_df = pd.read_csv(DATA_CSV) if os.path.exists(DATA_CSV) else pd.DataFrame()

if 'date' in data_df.columns:
    data_df['date'] = pd.to_datetime(data_df['date'])

def get_logged_user():
    return session.get('user')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip()
    password = data.get('password') or ''
    if not email:
        return jsonify({'ok': False, 'error': 'Email é obrigatório'}), 400
    user = users_df[users_df['email'] == email]
    if user.empty:
        return jsonify({'ok': False, 'error': 'Usuário não encontrado'}), 401
    stored_hash = user.iloc[0]['password_hash'].encode('utf-8')
    if not bcrypt.checkpw(password.encode('utf-8'), stored_hash):
        return jsonify({'ok': False, 'error': 'Senha incorreta'}), 401
    role = user.iloc[0]['role']
    session['user'] = {'email': email, 'role': role}
    return jsonify({'ok': True, 'email': email, 'role': role})

@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.pop('user', None)
    return jsonify({'ok': True})

@app.route('/api/me')
def api_me():
    user = get_logged_user()
    if not user:
        return jsonify({'authenticated': False}), 200
    return jsonify({'authenticated': True, 'email': user['email'], 'role': user['role']})

@app.route('/api/data')
def api_data():
    user = get_logged_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    role = user['role']

    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    sort_by = request.args.get('sort_by')
    sort_dir = request.args.get('sort_dir', 'asc')
    try:
        page = int(request.args.get('page', '1'))
        page_size = int(request.args.get('page_size', '50'))
    except ValueError:
        page = 1
        page_size = 50

    df = data_df.copy()
    if 'date' in df.columns:
        if start_date:
            try:
                sd = pd.to_datetime(start_date)
                df = df[df['date'] >= sd]
            except Exception:
                pass
        if end_date:
            try:
                ed = pd.to_datetime(end_date)
                df = df[df['date'] <= ed]
            except Exception:
                pass
    if sort_by and sort_by in df.columns:
        ascending = (sort_dir == 'asc')
        try:
            df = df.sort_values(by=sort_by, ascending=ascending)
        except Exception:
            pass

    if role != 'admin' and 'cost_micros' in df.columns:
        df = df.drop(columns=['cost_micros'])

    total = len(df)
    if page < 1:
        page = 1
    start = (page - 1) * page_size
    end = start + page_size
    page_df = df.iloc[start:end].copy()

    if 'date' in page_df.columns:
        page_df['date'] = page_df['date'].apply(lambda d: d.date().isoformat() if pd.notnull(d) else None)

    items = page_df.to_dict(orient='records')
    columns = list(page_df.columns)
    return jsonify({'total': total, 'page': page, 'page_size': page_size, 'items': items, 'columns': columns})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
