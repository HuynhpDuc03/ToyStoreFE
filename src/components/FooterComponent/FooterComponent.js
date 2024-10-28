import { ArrowUpOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FooterComponent = () => {
  const { t } = useTranslation();
  return (
    <div>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer__about">
                <div className="footer__logo">
                  <Link to="/">
                  <img width={150} height={53} src={require("../../img/logo.webp")} />
                  </Link>
                </div>
                <p>
                  {t('footer.Description')}
                </p>
                <a href="/">
                  <img src={require("../../img/payment.png")} alt="" />
                </a>
              </div>
            </div>
            <div className="col-lg-2 offset-lg-1 col-md-3 col-sm-6">
              <div className="footer__widget">
                <h6> {t('footer.Shopping')}</h6>
                <ul>
                  <li>
                  <a href="/">{t('footer.blog')}</a>
                  </li>
                  <li>
                  <a href="/">{t('footer.payment')}</a>
                  </li>
                  <li>
                  <a href="/">{t('footer.terms')}</a>
                  </li>
                  <li>
                  <a href="/">{t('footer.returnPolicy')}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-6">
              <div className="footer__widget">
              <h6> {t('footer.privacy')}</h6>
                <ul>
                  <li>
                    <a href="/">{t('footer.contactUs')}</a>
                  </li>
                  <li>
                  <a href="/">{t('footer.payment')}</a>
                  </li>
                  <li>
                  <a href="/">{t('footer.terms')}</a>
                  </li>
                  <li>
                  <a href="/">{t('footer.returnPolicy')}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 offset-lg-1 col-md-6 col-sm-6">
              <div className="footer__widget">
                <h6>NewLetter</h6>
                <div className="footer__newslatter">
                  <p>
                   {t('footer.SubLetterDescription')}
                  </p>
                  <form action="#">
                    <input type="text" placeholder={t('footer.yourEmail')} />
                    <button type="submit">
                      <span className="icon_mail_alt"></span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="footer__copyright__text">
                <p>
                {t('footer.copyright')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
     
    </div>
  );
};

export default FooterComponent;
