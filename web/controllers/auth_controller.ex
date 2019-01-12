defmodule Discuss.AuthController do
  use Discuss.Web, :controller
  plug Ueberauth

  def callback(conn, params) do 
    conn
    |> put_flash(:error, "callback/2 not implemented")
    |> redirect(to: topic_path(conn, :index))
  end
end