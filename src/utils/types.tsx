import { Contract } from "web3";
import voterReaderAbi from "../assets/contracts/VoterReader.abi.json";

export type SystemConfig = {
  voterAddress: string;
  voterReaderAddress: string;
  candidateAddress: string;
  votechainAddress: string;
  permissionsAddress: string;
  linkerAddress: string;
  rpcUrl: string;
  wsUrl: string;
  websocketServer: string;
  localServer: string;
};

export type Election = {
  id: number;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  constituency: string;
  resultsPublished: boolean;
};

export type Contracts = {
  voter: Contract<any> | null;
  voterReader: Contract<typeof voterReaderAbi> | null;
  candidate: Contract<any> | null;
  votechain: Contract<any> | null;
  permissions: Contract<any> | null;
  linker: Contract<any> | null;
};

export type State = {
  id: string;
  code: string;
  name: string;
  no_of_districts: number;
};

export type District = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  image: string | null;
  link: string | null;
  state: string;
  no_of_constituencies: number;
};

export type Constituency = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  image: string | null;
  link: string | null;
  district: string;
};

export type VoterPersonalInfo = {
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: string;
};

export type VoterContactInfo = {
  email: string;
  phone: string;
};

export type VoterAddressInfo = {
  state: string;
  district: string;
  locality: string;
  ward: string;
  house_name: string;
  house_number: string;
  street: string;
  pincode: string;
};

export type VoterInfo = {
  aadhar_number: string;
  personal_info: VoterPersonalInfo;
  contact_info: VoterContactInfo;
  permenant_address: VoterAddressInfo;
  current_address: VoterAddressInfo;
  married: boolean;
  orphan: boolean;
  constituency: string;
};

export type VoterRegistration = {
  voter_id: number;
  voter_info: VoterInfo;
  voter_address: string;
  status: number;
};

export type VoterAccount = {
  voter_address: string;
  voter_info: VoterInfo;
};

export type AdminInfo = {
  name: string;
  role: string;
};
export type CandidateProfile = {
  profileId: string;
  candidateId: string;
  address: string;
  name: string;
  about: string | null;
  photo: string | null;
  education: Education[];
  experience: Experience[];
  documents: Documents[];
  party: Party;
  phone: string | null;
  email: string | null;
  candidateAddress: string | null;
  logo: string | null;
};
export type Documents = {
  title: string;
  link: string;
};
export type Education = {
  educationId: string | null;
  title: string;
  description: string;
  fromWhere: string;
};
export type Experience = {
  educationId: string;
  title: string;
  description: string;
  fromWhere: string;
};

export type Party = {
  partyId: string;
  name: string;
  logo: string;
};

export function voterPersonalInfoFromList(list: any[]): VoterPersonalInfo {
  return {
    first_name: list[0],
    middle_name: list[1],
    last_name: list[2],
    dob: list[3],
  };
}
export function voterContactInfoFromList(list: any[]): VoterContactInfo {
  return {
    email: list[1],
    phone: list[0],
  };
}
export function voterAddressInfoFromList(list: any[]): VoterAddressInfo {
  return {
    state: list[0],
    district: list[1],
    locality: list[2],
    ward: list[3],
    house_name: list[4],
    house_number: list[5],
    street: list[6],
    pincode: list[7],
  };
}
export function voterInfoFromList(list: any[]): VoterInfo {
  return {
    aadhar_number: list[0],
    personal_info: voterPersonalInfoFromList(list[1]),
    contact_info: voterContactInfoFromList(list[2]),
    permenant_address: voterAddressInfoFromList(list[3]),
    current_address: voterAddressInfoFromList(list[4]),
    married: list[5],
    orphan: list[6],
    constituency: list[7],
  };
}
export function voterRegistrationFromList(
  list: any[]
): VoterRegistration | null {
  // eslint-disable-next-line
  if (list[2] == 0) {
    return null;
  }
  return {
    voter_id: list[0],
    voter_info: voterInfoFromList(list[1]),
    voter_address: list[2],
    status: list[3],
  };
}

export function voterAccountFromList(list: any[]): VoterAccount | null {
  // eslint-disable-next-line
  if (list[0] == 0) {
    return null;
  }
  return {
    voter_address: list[0],
    voter_info: voterInfoFromList(list[1]),
  };
}

export function adminInfoFromList(list: any[]): AdminInfo | null {
  if (list[1] === 0) {
    return null;
  }
  var role;
  switch (parseInt((list[1] as BigInt).toString())) {
    case 1:
      role = "Super Admin";
      break;
    case 2:
      role = "Authority";
      break;
    case 3:
      role = "Polling Officer";
      break;
    case 4:
      role = "Locality Officer";
      break;
    case 5:
      role = "Returning Officer";
      break;
    default:
      role = "Unknown role";
  }
  return {
    name: list[0],
    role: role,
  };
}

export function electionFromList(list: any[]): Election | null {
  if (list[0] == 0) {
    return null;
  }
  return {
    id: parseInt((list[0] as BigInt).toString()),
    name: list[1],
    description: list[2],
    start_date: new Date(parseInt((list[3] as BigInt).toString())),
    end_date: new Date(parseInt((list[4] as BigInt).toString())),
    constituency: list[5],
    resultsPublished: parseInt(list[6].toString()) == 0 ? false : true,
  } as Election;
}
