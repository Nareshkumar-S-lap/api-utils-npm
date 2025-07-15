import { v4 as uuidv4 } from "uuid";
import libphonenumber, { PhoneNumberUtil } from "google-libphonenumber";
import config from "config";
import { logger } from "@common/logger";

export class Utils {
  static uuid = (): string => uuidv4();
  private static readonly phoneUtil: PhoneNumberUtil = libphonenumber.PhoneNumberUtil.getInstance();

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  static isValidPhoneNumber(
    phoneNumber: string
  ): boolean | { success: false; errorMessage: string } {
    try {
      const parsedNumber = this.phoneUtil.parse(phoneNumber);
      return this.phoneUtil.isValidNumber(parsedNumber);
    } catch (error: any) {
      logger.info("error-phonelib", error);
      return false;
    }
  }
  static formatPhoneNumber(inputPhoneNumber: string): {
    success: boolean;
    phoneNumber?: string;
    errorMessage?: string;
  } {
    try {
      const parsedPhoneNumber = this.phoneUtil.parse(inputPhoneNumber, config.get("defaultRegion"));

      // Format to E.164 without spaces
      const formattedPhoneNumber = this.phoneUtil.format(
        parsedPhoneNumber,
        libphonenumber.PhoneNumberFormat.E164
      );

      // Check if the formatted number is valid
      const isValid = this.phoneUtil.isValidNumber(
        this.phoneUtil.parse(formattedPhoneNumber, config.get("defaultRegion"))
      );

      return { success: isValid, phoneNumber: formattedPhoneNumber };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error.message
      };
    }
  }

  static getMobileNumber = (number: any) => {
    const getRawInput = this.phoneUtil.parseAndKeepRawInput(number);
    return `${getRawInput.getCountryCode()}${getRawInput.getNationalNumber()}`;
  };

  static isValid = (number: string) =>
    this.phoneUtil.isPossibleNumberString(number, config.get("defaultRegion"));

  static parse(number: string) {
    if (this.isValid(number)) {
      const phoneNumber = this.phoneUtil.parseAndKeepRawInput(number, config.get("defaultRegion"));
      return {
        mobile: `+${phoneNumber.getCountryCode()}${phoneNumber.getNationalNumber()}`,
        valid: true,
        countryCode: phoneNumber.getCountryCode(),
        nationalNumber: phoneNumber.getNationalNumber(),
        rawInput: phoneNumber.getRawInput()
      };
    }
    return {
      valid: false
    };
  }
}
